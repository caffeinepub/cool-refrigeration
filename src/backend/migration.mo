import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
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
    timestamp : Time.Time;
  };

  type Review = {
    id : Nat;
    name : Text;
    stars : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  type OldChatMessage = {
    id : Nat;
    name : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type NewChatMessage = {
    id : Nat;
    name : Text;
    sessionId : Text;
    message : Text;
    timestamp : Time.Time;
    reply : ?Text;
  };

  type OldActor = {
    orders : Map.Map<Nat, Order>;
    reviews : Map.Map<Nat, Review>;
    chatMessages : Map.Map<Nat, OldChatMessage>;
    nextOrderId : Nat;
    nextReviewId : Nat;
    nextChatId : Nat;
  };

  type NewActor = {
    orders : Map.Map<Nat, Order>;
    reviews : Map.Map<Nat, Review>;
    chatMessages : Map.Map<Nat, NewChatMessage>;
    nextOrderId : Nat;
    nextReviewId : Nat;
    nextChatId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newChatMessages = old.chatMessages.map<Nat, OldChatMessage, NewChatMessage>(
      func(_id, oldChat) {
        {
          id = oldChat.id;
          name = oldChat.name;
          sessionId = "";
          message = oldChat.message;
          timestamp = oldChat.timestamp;
          reply = null;
        };
      }
    );
    {
      old with
      chatMessages = newChatMessages;
    };
  };
};
