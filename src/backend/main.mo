import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Migration "migration";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";

(with migration = Migration.run)
actor {
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

  type ChatMessage = {
    id : Nat;
    name : Text;
    sessionId : Text;
    message : Text;
    timestamp : Time.Time;
    reply : ?Text;
  };

  let orders = Map.empty<Nat, Order>();
  let reviews = Map.empty<Nat, Review>();
  let chatMessages = Map.empty<Nat, ChatMessage>();

  var nextOrderId = 0;
  var nextReviewId = 0;
  var nextChatId = 0;

  public shared ({ caller }) func submitOrder(name : Text, phone : Text, email : Text, service_type : Text, product_interest : Text, address : Text, preferred_date : Text, notes : Text) : async Bool {
    let order : Order = {
      id = nextOrderId;
      name;
      phone;
      email;
      service_type;
      product_interest;
      address;
      preferred_date;
      notes;
      timestamp = Time.now();
    };
    orders.add(nextOrderId, order);
    nextOrderId += 1;
    true;
  };

  public shared ({ caller }) func submitReview(name : Text, stars : Nat, message : Text) : async Bool {
    if (stars < 1 or stars > 5) { return false };

    let review : Review = {
      id = nextReviewId;
      name;
      stars;
      message;
      timestamp = Time.now();
    };
    reviews.add(nextReviewId, review);
    nextReviewId += 1;
    true;
  };

  public shared ({ caller }) func sendChatMessage(name : Text, sessionId : Text, message : Text) : async Bool {
    if (name.size() == 0 or message.size() == 0) { return false };
    let chatMessage : ChatMessage = {
      id = nextChatId;
      name;
      sessionId;
      message;
      timestamp = Time.now();
      reply = null;
    };
    chatMessages.add(nextChatId, chatMessage);
    nextChatId += 1;
    true;
  };

  public shared ({ caller }) func replyToChat(id : Nat, reply : Text) : async Bool {
    switch (chatMessages.get(id)) {
      case (null) { false };
      case (?chatMessage) {
        let updatedChat : ChatMessage = { chatMessage with reply = ?reply };
        chatMessages.add(id, updatedChat);
        true;
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.values().toArray();
  };

  public query ({ caller }) func getAllChatMessages() : async [ChatMessage] {
    chatMessages.values().toArray();
  };

  public query ({ caller }) func getChatMessagesBySession(sessionId : Text) : async [ChatMessage] {
    chatMessages.values().filter(
      func(chatMessage) {
        chatMessage.sessionId == sessionId;
      }
    ).toArray();
  };
};
