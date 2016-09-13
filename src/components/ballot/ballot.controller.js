class BallotController {
  // @ngInject
  constructor(voteService) {
    this.voteService = voteService;
    this.votingEnabled = false;
  }

  submitVote() {
    this.voteService.sendVote(this.ballotForm).then((response) => {
      console.log('succes', response);
    }, (response) => {
      console.log('error', response);
    });
  }
}

export default BallotController;
