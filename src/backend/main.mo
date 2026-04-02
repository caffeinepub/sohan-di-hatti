import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types - User Profile
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Data Types - Product
  public type Product = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    isBestSeller : Bool;
    isAvailable : Bool;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  // Data Types - Order
  public type OrderItem = {
    productId : Nat;
    productName : Text;
    quantity : Nat;
    price : Nat;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
  };

  public type ShopOrder = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  module ShopOrder {
    public func compare(order1 : ShopOrder, order2 : ShopOrder) : Order.Order {
      Text.compare(order1.customerName, order2.customerName);
    };
  };

  let orders = Map.empty<Nat, ShopOrder>();
  var nextOrderId = 1;

  // Data Types - Contact Query
  public type ContactQuery = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    createdAt : Time.Time;
  };

  module ContactQuery {
    public func compare(query1 : ContactQuery, query2 : ContactQuery) : Order.Order {
      Text.compare(query1.name, query2.name);
    };
  };

  let contactQueries = Map.empty<Nat, ContactQuery>();
  var nextContactQueryId = 1;

  // Product Management (Admin Only)
  public shared ({ caller }) func createProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let newProduct : Product = {
      product with
      id = nextProductId;
    };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct.id;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(product.id)) { Runtime.trap("Product not found") };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) { Runtime.trap("Product not found") };
    products.remove(productId);
  };

  // Public Product Queries (No Authentication Required)
  public query func getProduct(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func listBestSellers() : async [Product] {
    products.values().toArray().filter(
      func(p) { p.isBestSeller }
    ).sort();
  };

  public query func listProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(p) { p.category == category }
    ).sort();
  };

  // Place Order (Public)
  public shared ({ caller }) func placeOrder(order : ShopOrder) : async Nat {
    let newOrder : ShopOrder = {
      order with
      id = nextOrderId;
      status = #pending;
      createdAt = Time.now();
    };
    orders.add(nextOrderId, newOrder);
    nextOrderId += 1;
    newOrder.id;
  };

  // Order Management (Admin Only)
  public query ({ caller }) func getOrder(orderId : Nat) : async ShopOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    switch (orders.get(orderId)) {
      case (?order) { order };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func listOrders() : async [ShopOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list orders");
    };
    orders.values().toArray().sort();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update orders");
    };
    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder = {
          order with
          status;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  // Submit Contact Query (Public)
  public shared ({ caller }) func submitContactQuery(contactQuery : ContactQuery) : async Nat {
    let newQuery : ContactQuery = {
      contactQuery with
      id = nextContactQueryId;
      createdAt = Time.now();
    };
    contactQueries.add(nextContactQueryId, newQuery);
    nextContactQueryId += 1;
    newQuery.id;
  };

  // List Contact Queries (Admin Only)
  public query ({ caller }) func listContactQueries() : async [ContactQuery] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list contact queries");
    };
    contactQueries.values().toArray().sort();
  };

  // Seed Initial Products (Public - runs only if empty)
  public shared func seedProducts() : async () {
    if (products.isEmpty()) {
      let initialProducts : [Product] = [
        // Mithai
        {
          id = 1;
          name = "Pinni";
          category = "Mithai";
          description = "Traditional Punjabi wheat flour pinni made with ghee, sugar, and dry fruits. A winter specialty of Amritsar.";
          price = 60000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
        {
          id = 2;
          name = "Sohan Halwa";
          category = "Mithai";
          description = "Soft, melt-in-the-mouth halwa made from maida, sugar, ghee, and saffron. The signature sweet of Sohan Di Hatti.";
          price = 70000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
        {
          id = 3;
          name = "Besan Burfi";
          category = "Mithai";
          description = "Rich gram flour fudge slow-roasted in pure desi ghee, sweetened and garnished with silver leaf.";
          price = 55000;
          imageUrl = "";
          isBestSeller = false;
          isAvailable = true;
        },
        {
          id = 4;
          name = "Gulab Jamun";
          category = "Mithai";
          description = "Soft khoya dumplings fried golden and soaked overnight in rose-flavoured sugar syrup.";
          price = 45000;
          imageUrl = "";
          isBestSeller = false;
          isAvailable = true;
        },
        {
          id = 5;
          name = "Kaju Katli";
          category = "Mithai";
          description = "Diamond-shaped cashew fudge with a delicate silver varq topping. A festive favourite.";
          price = 80000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
        {
          id = 6;
          name = "Mohanthal";
          category = "Mithai";
          description = "Classic Gujarati-Punjabi besan sweet with cardamom, saffron, and a crumbly ghee-rich texture.";
          price = 55000;
          imageUrl = "";
          isBestSeller = false;
          isAvailable = true;
        },
        {
          id = 7;
          name = "Patisa (Soan Papdi)";
          category = "Mithai";
          description = "Flaky, crispy layered sweet made from besan and maida, laced with cardamom and pistachio shavings.";
          price = 40000;
          imageUrl = "";
          isBestSeller = false;
          isAvailable = true;
        },
        {
          id = 8;
          name = "Jalebi";
          category = "Mithai";
          description = "Freshly fried crispy spirals soaked in thick sugar syrup. Best enjoyed warm with rabri.";
          price = 30000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
        // Namkeen
        {
          id = 9;
          name = "Amritsari Papad";
          category = "Namkeen";
          description = "Crispy thin papads roasted to perfection, a classic Amritsari accompaniment.";
          price = 20000;
          imageUrl = "";
          isBestSeller = false;
          isAvailable = true;
        },
        {
          id = 10;
          name = "Mathri";
          category = "Namkeen";
          description = "Flaky salted biscuits fried in pure ghee, seasoned with ajwain and kali mirch.";
          price = 25000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
        {
          id = 11;
          name = "Moong Dal Namkeen";
          category = "Namkeen";
          description = "Crunchy split moong dal fried light and tossed with spices. A favourite teatime snack.";
          price = 22000;
          imageUrl = "";
          isBestSeller = false;
          isAvailable = true;
        },
        {
          id = 12;
          name = "Punjabi Mix Namkeen";
          category = "Namkeen";
          description = "A spicy-crunchy medley of sev, boondi, dry fruits, and fried lentils — Punjab's iconic snack mix.";
          price = 28000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
        {
          id = 13;
          name = "Shakkar Para";
          category = "Namkeen";
          description = "Sweet fried dough strips coated in sugar syrup — a traditional Punjabi teatime treat.";
          price = 20000;
          imageUrl = "";
          isBestSeller = false;
          isAvailable = true;
        },
        // Seasonal
        {
          id = 14;
          name = "Gajak";
          category = "Seasonal";
          description = "Winter sesame and jaggery brittle, sun-dried and pressed into crisp slabs. Available Nov–Feb.";
          price = 35000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
        {
          id = 15;
          name = "Rewri";
          category = "Seasonal";
          description = "Tiny sesame-jaggery discs — a Lohri and winter staple from Amritsar's oldest sweet shops.";
          price = 25000;
          imageUrl = "";
          isBestSeller = false;
          isAvailable = true;
        },
        {
          id = 16;
          name = "Diwali Mithai Box";
          category = "Seasonal";
          description = "Curated festive assortment of Kaju Katli, Besan Burfi, and Pinni in a decorative gift box.";
          price = 150000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
        {
          id = 17;
          name = "Gajar Halwa";
          category = "Seasonal";
          description = "Slow-cooked red carrot halwa with full-cream milk, sugar, ghee, and cardamom. Winter special.";
          price = 50000;
          imageUrl = "";
          isBestSeller = true;
          isAvailable = true;
        },
      ];
      for (product in initialProducts.values()) {
        products.add(product.id, product);
      };
      nextProductId := 18;
    };
  };
};
