import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  type Review = {
    id : Nat;
    name : Text;
    stars : Nat;
    message : Text;
    timestamp : Int;
  };

  type Order = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    service_type : Text;
    product_interest : Text;
    address : Text;
    preferred_date : Text;
    notes : Text;
    timestamp : Int;
  };

  type ChatMessage = {
    id : Nat;
    name : Text;
    message : Text;
    timestamp : Int;
  };

  type OldActor = {
    reviews : Map.Map<Nat, Review>;
    orders : Map.Map<Nat, Order>;
    nextReviewId : Nat;
    nextOrderId : Nat;
    adminPassword : Text;
  };

  type NewActor = {
    reviews : Map.Map<Nat, Review>;
    orders : Map.Map<Nat, Order>;
    chatMessages : Map.Map<Nat, ChatMessage>;
    nextReviewId : Nat;
    nextOrderId : Nat;
    nextChatId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      reviews = old.reviews;
      orders = old.orders;
      chatMessages = Map.empty<Nat, ChatMessage>();
      nextReviewId = old.nextReviewId;
      nextOrderId = old.nextOrderId;
      nextChatId = 0;
    };
  };
};
