class ResultsController {
  // @ngInject
  constructor(votingResults, topoData) {
    this.votingResults = votingResults.data;
    this.topoData = topoData.data;
  }
}

export default ResultsController;
