module {
  type NewActor = { nextReviewId : Nat; nextOrderId : Nat };

  public func run(_old : {}) : NewActor {
    { nextReviewId = 0; nextOrderId = 0 };
  };
};
