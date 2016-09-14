class BallotController {
  // @ngInject
  constructor(voteService) {
    this.voteService = voteService;
    this.votingEnabled = false;

    this.votingSuccess = this.votingSuccess.bind(this);
    this.votingError = this.votingError.bind(this);
  }

  submitVote() {
    this.apiError = false;
    this.votingInProgress = true;
    this.voteService.sendVote(this.ballotForm)
      .then(this.votingSuccess)
      .catch(this.votingError)
      .finally(() => {
        this.votingInProgress = false;
      });
  }

  votingSuccess(response) {
    console.log('succes', response);

  }

  votingError(response) {
    console.log('error', response);
    this.apiError = response.data.error;
  }
}

export default BallotController;
