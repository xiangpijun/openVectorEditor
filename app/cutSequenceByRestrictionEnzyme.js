var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');
var ac = require('ve-api-check');
var normalizePositionByRangeLength = require('./normalizePositionByRangeLength.js');
var reversePositionInRange = require('./reversePositionInRange.js');

module.exports = function cutSequenceByRestrictionEnzyme(pSequence, circular, restrictionEnzyme) {
    ac.throw([
        ac.string,
        ac.bool,
        ac.shape({
            "name": ac.string,
            "site": ac.string,
            "forwardRegex": ac.string,
            "reverseRegex": ac.string,
            "cutType": ac.number,
            "dsForward": ac.number,
            "dsReverse": ac.number,
            "usForward": ac.number,
            "usReverse": ac.number
        })
    ], arguments);
    var reverseRegExpPattern = new RegExp(restrictionEnzyme.reverseRegex, "ig");
    var forwardRegExpPattern = new RegExp(restrictionEnzyme.forwardRegex, "ig");
    var sequence = pSequence;

    var cutsitesForward = cutSequence(forwardRegExpPattern, restrictionEnzyme, sequence, circular);
    var cutsitesReverse = [];
    if (restrictionEnzyme.forwardRegex !== restrictionEnzyme.reverseRegex) {
        var revSequence = getReverseComplementSequenceString(sequence);
        cutsitesReverse = cutSequence(forwardRegExpPattern, restrictionEnzyme, revSequence, circular);
        cutsitesReverse = cutsitesReverse.map(function(cutsite) {
            return reverseAllPositionsOfCutsite(cutsite, sequence.length);
        });
    }
    return (cutsitesForward.concat(cutsitesReverse));

    function reverseAllPositionsOfCutsite(cutsite, rangeLength) {
        debugger;
        cutsite.start = reversePositionInRange(cutsite.start, rangeLength, false);
        cutsite.end = reversePositionInRange(cutsite.end, rangeLength, false);
        cutsite.downstreamTopSnip = reversePositionInRange(cutsite.downstreamTopSnip, rangeLength, true);
        cutsite.downstreamBottomSnip = reversePositionInRange(cutsite.downstreamBottomSnip, rangeLength, true);
        if (cutsite.cutType === 1) {
            cutsite.upstreamTopSnip = reversePositionInRange(cutsite.upstreamTopSnip, rangeLength, true);
            cutsite.upstreamBottomSnip = reversePositionInRange(cutsite.upstreamBottomSnip, rangeLength, true);
        }
        cutsite.recognitionSiteRange.start = reversePositionInRange(cutsite.recognitionSiteRange.start, rangeLength, false);
        cutsite.recognitionSiteRange.end = reversePositionInRange(cutsite.recognitionSiteRange.end, rangeLength, false);
        return {
            start: cutsite.end,
            end: cutsite.start,
            downstreamTopSnip: cutsite.downstreamBottomSnip,
            downstreamBottomSnip: cutsite.downstreamTopSnip,
            upstreamTopSnip: cutsite.upstreamBottomSnip,
            upstreamBottomSnip: cutsite.upstreamTopSnip,
            recognitionSiteRange: {
                start: cutsite.recognitionSiteRange.end,
                end: cutsite.recognitionSiteRange.start
            },
            forward: false,
            restrictionEnzyme: cutsite.restrictionEnzyme
        };
    }

    function cutSequence(regExpPattern, restrictionEnzyme, sequence, circular) {
        var restrictionCutSites = [];
        var restrictionCutSite;
        var recognitionSiteLength = restrictionEnzyme.site.length;
        var originalSequenceLength = sequence.length;
        if (circular) {
            //if the sequence is circular, we send in double the sequence
            //we'll deduplicate the results afterwards!
            sequence += sequence;
        }
        var currentSequenceLength = sequence.length;

        var matchIndex = sequence.search(forwardRegExpPattern);
        var startIndex = 0;
        var subSequence = sequence;


        while (matchIndex != -1) {
            var recognitionSiteRange = {};
            var start; //start and end should fully enclose the enzyme snips and the recognition site!
            var end;
            var upstreamTopSnip; //upstream top snip position
            var upstreamBottomSnip; //upstream bottom snip position
            var downstreamTopSnip; //downstream top snip position
            var downstreamBottomSnip; //downstream bottom snip position
            // if (matchIndex + startIndex + recognitionSiteLength - 1 >= sequence.length) { // subSequence is too short
            //     break;
            // }

            recognitionSiteRange.start = matchIndex + startIndex;
            start = recognitionSiteRange.start; //this might change later on!

            recognitionSiteRange.end = matchIndex + recognitionSiteLength - 1 + startIndex;
            end = recognitionSiteRange.end; //this might change later on!

            //we need to get the snip sites, top and bottom for each of these cut sites
            //as well as all of the bp's between the snip sites

            //if the cutsite is type 1, it cuts both upstream and downstream of its recognition site (cutsite type 0's cut only downstream)
            if (restrictionEnzyme.cutType == 1) { //double cutter, add upstream cutsite here
                upstreamTopSnip = recognitionSiteRange.start - restrictionEnzyme.usForward;
                upstreamBottomSnip = recognitionSiteRange.start - restrictionEnzyme.usReverse;
                if (upstreamTopSnip < upstreamBottomSnip) {
                    start = upstreamTopSnip;
                } else {
                    start = upstreamBottomSnip;
                }
                upstreamTopSnip = normalizePositionByRangeLength(upstreamTopSnip, originalSequenceLength, true);
                upstreamBottomSnip = normalizePositionByRangeLength(upstreamBottomSnip, originalSequenceLength, true);
            }


            //add downstream cutsite here
            downstreamTopSnip = recognitionSiteRange.start + restrictionEnzyme.dsForward;
            downstreamBottomSnip = recognitionSiteRange.start + restrictionEnzyme.dsReverse;
            if (downstreamTopSnip > downstreamBottomSnip) {
                if (downstreamTopSnip > recognitionSiteRange.end) {
                    end = downstreamTopSnip - 1;
                }
            } else {
                if (downstreamBottomSnip > recognitionSiteRange.end) {
                    end = downstreamBottomSnip - 1;
                }
            }

            if (start >= 0 && end >= 0 && start < originalSequenceLength && end < currentSequenceLength) {
                //only push cutsites onto the array if they are fully contained within the boundaries of the sequence!
                //and they aren't duplicated
                downstreamTopSnip = normalizePositionByRangeLength(downstreamTopSnip, originalSequenceLength, true);
                downstreamBottomSnip = normalizePositionByRangeLength(downstreamBottomSnip, originalSequenceLength, true);
                start = normalizePositionByRangeLength(start, originalSequenceLength, false);
                end = normalizePositionByRangeLength(end, originalSequenceLength, false);
                recognitionSiteRange.start = normalizePositionByRangeLength(recognitionSiteRange.start, originalSequenceLength, false);
                recognitionSiteRange.end = normalizePositionByRangeLength(recognitionSiteRange.end, originalSequenceLength, false);

                restrictionCutSite = {
                    start: start,
                    end: end,
                    downstreamTopSnip: downstreamTopSnip,
                    downstreamBottomSnip: downstreamBottomSnip,
                    upstreamTopSnip: upstreamTopSnip,
                    upstreamBottomSnip: upstreamBottomSnip,
                    recognitionSiteRange: recognitionSiteRange,
                    forward: true,
                    restrictionEnzyme: restrictionEnzyme
                };
                restrictionCutSites.push(restrictionCutSite);
            }


            // Make sure that we always store the previous match index to ensure
            // that we are always storing indices relative to the whole sequence,
            // not just the subSequence.
            startIndex = startIndex + matchIndex + 1;

            // Search again on subSequence, starting from the index of the last match + 1.
            subSequence = sequence.substring(startIndex, sequence.length);
            matchIndex = subSequence.search(forwardRegExpPattern);
        }
        return restrictionCutSites;
    }
}