import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Review = {
    id : Nat;
    name : Text;
    stars : Nat;
    message : Text;
    timestamp : Time.Time;
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
    timestamp : Time.Time;
  };

  let reviews = Map.empty<Nat, Review>();
  let orders = Map.empty<Nat, Order>();
  var nextReviewId = 0;
  var nextOrderId = 0;
  let adminPassword = "c00lRf3g!";

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

  public query ({ caller }) func getAllReviews(password : Text) : async ?[Review] {
    if (password != adminPassword) { return null };
    ?reviews.values().toArray();
  };

  public query ({ caller }) func getAllOrders(password : Text) : async ?[Order] {
    if (password != adminPassword) { return null };
    ?orders.values().toArray();
  };

  public query ({ caller }) func verifyAdmin(password : Text) : async Bool {
    password == adminPassword;
  };
};
