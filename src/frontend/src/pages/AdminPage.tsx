import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogIn, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type ContactQuery,
  OrderStatus,
  type Product,
  type ShopOrder,
} from "../backend";
import OrnamentalDivider from "../components/OrnamentalDivider";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "Mithai",
  description: "",
  price: 0n,
  imageUrl: "",
  isBestSeller: false,
  isAvailable: true,
};

export default function AdminPage() {
  const { actor } = useActor();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [contacts, setContacts] = useState<ContactQuery[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [productForm, setProductForm] =
    useState<Omit<Product, "id">>(emptyProduct);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    if (!actor) return;
    if (isLoggedIn) {
      setCheckingAdmin(true);
      actor
        .isCallerAdmin()
        .then((v) => setIsAdmin(v))
        .catch(() => setIsAdmin(false))
        .finally(() => setCheckingAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [isLoggedIn, actor]);

  useEffect(() => {
    if (isAdmin && actor) {
      loadAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, actor]);

  async function loadAllData() {
    if (!actor) return;
    setLoadingData(true);
    try {
      const [p, o, c] = await Promise.all([
        actor.listProducts(),
        actor.listOrders(),
        actor.listContactQueries(),
      ]);
      setProducts(p);
      setOrders(o);
      setContacts(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  }

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setProductDialogOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      isBestSeller: p.isBestSeller,
      isAvailable: p.isAvailable,
    });
    setProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!actor) return;
    setSavingProduct(true);
    try {
      if (editingProduct) {
        await actor.updateProduct({ ...productForm, id: editingProduct.id });
        toast.success("Product updated.");
      } else {
        await actor.createProduct({ ...productForm, id: 0n });
        toast.success("Product created.");
      }
      setProductDialogOpen(false);
      await loadAllData();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save product.");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: bigint) => {
    if (!actor) return;
    if (!confirm("Delete this product?")) return;
    try {
      await actor.deleteProduct(id);
      toast.success("Product deleted.");
      await loadAllData();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete product.");
    }
  };

  const handleUpdateStatus = async (orderId: bigint, status: OrderStatus) => {
    if (!actor) return;
    try {
      await actor.updateOrderStatus(orderId, status);
      toast.success("Order status updated.");
      await loadAllData();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status.");
    }
  };

  return (
    <div>
      {/* Header */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #1a0f08 0%, #3A2A1E 100%)",
        }}
      >
        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "#FAF2E2" }}
        >
          Admin Panel
        </h1>
        <p
          style={{ color: "#C9A46A" }}
          className="text-sm tracking-widest uppercase"
        >
          Sohan Di Hatti Management
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <OrnamentalDivider />

        {!isLoggedIn ? (
          <div className="text-center py-20" data-ocid="admin.panel">
            <p className="text-lg mb-6" style={{ color: "#5a3a22" }}>
              Please log in to access the admin panel.
            </p>
            <button
              type="button"
              onClick={login}
              disabled={loginStatus === "logging-in"}
              className="inline-flex items-center gap-2 px-8 py-3 rounded font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#A95512" }}
              data-ocid="admin.primary_button"
            >
              {loginStatus === "logging-in" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              Login with Internet Identity
            </button>
          </div>
        ) : checkingAdmin ? (
          <div
            className="flex justify-center py-20"
            data-ocid="admin.loading_state"
          >
            <Loader2
              className="w-10 h-10 animate-spin"
              style={{ color: "#A95512" }}
            />
          </div>
        ) : !isAdmin ? (
          <div className="text-center py-20" data-ocid="admin.error_state">
            <p className="text-2xl mb-2" style={{ color: "#A95512" }}>
              🚫
            </p>
            <h2 className="text-xl font-bold mb-4" style={{ color: "#3A2A1E" }}>
              Access Denied
            </h2>
            <p className="text-sm mb-6" style={{ color: "#5a3a22" }}>
              You don&apos;t have admin privileges for this panel.
            </p>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 px-6 py-2 rounded font-semibold border-2 transition-colors"
              style={{ borderColor: "#A95512", color: "#A95512" }}
              data-ocid="admin.secondary_button"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <div data-ocid="admin.section">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm" style={{ color: "#5a3a22" }}>
                Logged in as:{" "}
                <strong>{identity?.getPrincipal().toString()}</strong>
              </p>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded border"
                style={{ borderColor: "#A95512", color: "#A95512" }}
                data-ocid="admin.secondary_button"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {loadingData ? (
              <div
                className="flex justify-center py-12"
                data-ocid="admin.loading_state"
              >
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "#A95512" }}
                />
              </div>
            ) : (
              <Tabs defaultValue="products">
                <TabsList
                  className="mb-6"
                  style={{ backgroundColor: "#FAF2E2" }}
                >
                  <TabsTrigger value="products" data-ocid="admin.tab">
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="orders" data-ocid="admin.tab">
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="contacts" data-ocid="admin.tab">
                    Contact Queries
                  </TabsTrigger>
                </TabsList>

                {/* Products Tab */}
                <TabsContent value="products">
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className="text-lg font-bold"
                      style={{ color: "#3A2A1E" }}
                    >
                      Products ({products.length})
                    </h3>
                    <Dialog
                      open={productDialogOpen}
                      onOpenChange={setProductDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          onClick={openAddProduct}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded font-semibold text-white text-sm"
                          style={{ backgroundColor: "#A95512" }}
                          data-ocid="admin.open_modal_button"
                        >
                          <Plus className="w-4 h-4" />
                          Add Product
                        </button>
                      </DialogTrigger>
                      <DialogContent data-ocid="admin.dialog">
                        <DialogHeader>
                          <DialogTitle>
                            {editingProduct
                              ? "Edit Product"
                              : "Add New Product"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-2">
                          <div>
                            <label
                              htmlFor="admin-name"
                              className="text-sm font-semibold"
                            >
                              Name
                            </label>
                            <input
                              id="admin-name"
                              value={productForm.name}
                              onChange={(e) =>
                                setProductForm((f) => ({
                                  ...f,
                                  name: e.target.value,
                                }))
                              }
                              className="w-full mt-1 px-3 py-2 rounded border text-sm"
                              style={{
                                borderColor: "#C9A46A",
                                backgroundColor: "#F4E9D2",
                              }}
                              data-ocid="admin.input"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="admin-category"
                              className="text-sm font-semibold"
                            >
                              Category
                            </label>
                            <select
                              id="admin-category"
                              value={productForm.category}
                              onChange={(e) =>
                                setProductForm((f) => ({
                                  ...f,
                                  category: e.target.value,
                                }))
                              }
                              className="w-full mt-1 px-3 py-2 rounded border text-sm"
                              style={{
                                borderColor: "#C9A46A",
                                backgroundColor: "#F4E9D2",
                              }}
                              data-ocid="admin.select"
                            >
                              <option>Mithai</option>
                              <option>Namkeen</option>
                              <option>Seasonal</option>
                              <option>Gift Boxes</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="admin-desc"
                              className="text-sm font-semibold"
                            >
                              Description
                            </label>
                            <textarea
                              id="admin-desc"
                              value={productForm.description}
                              onChange={(e) =>
                                setProductForm((f) => ({
                                  ...f,
                                  description: e.target.value,
                                }))
                              }
                              rows={2}
                              className="w-full mt-1 px-3 py-2 rounded border text-sm resize-none"
                              style={{
                                borderColor: "#C9A46A",
                                backgroundColor: "#F4E9D2",
                              }}
                              data-ocid="admin.textarea"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="admin-price"
                              className="text-sm font-semibold"
                            >
                              Price (paise, e.g. 25000 = ₹250)
                            </label>
                            <input
                              id="admin-price"
                              type="number"
                              value={Number(productForm.price)}
                              onChange={(e) =>
                                setProductForm((f) => ({
                                  ...f,
                                  price: BigInt(e.target.value || "0"),
                                }))
                              }
                              className="w-full mt-1 px-3 py-2 rounded border text-sm"
                              style={{
                                borderColor: "#C9A46A",
                                backgroundColor: "#F4E9D2",
                              }}
                              data-ocid="admin.input"
                            />
                          </div>
                          <div className="flex gap-4">
                            <label
                              htmlFor="admin-bestseller"
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                id="admin-bestseller"
                                type="checkbox"
                                checked={productForm.isBestSeller}
                                onChange={(e) =>
                                  setProductForm((f) => ({
                                    ...f,
                                    isBestSeller: e.target.checked,
                                  }))
                                }
                                data-ocid="admin.checkbox"
                              />
                              Best Seller
                            </label>
                            <label
                              htmlFor="admin-available"
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                id="admin-available"
                                type="checkbox"
                                checked={productForm.isAvailable}
                                onChange={(e) =>
                                  setProductForm((f) => ({
                                    ...f,
                                    isAvailable: e.target.checked,
                                  }))
                                }
                                data-ocid="admin.checkbox"
                              />
                              Available
                            </label>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button
                              type="button"
                              onClick={handleSaveProduct}
                              disabled={savingProduct}
                              className="flex-1 py-2 rounded font-semibold text-white text-sm disabled:opacity-60"
                              style={{ backgroundColor: "#A95512" }}
                              data-ocid="admin.save_button"
                            >
                              {savingProduct ? "Saving..." : "Save Product"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductDialogOpen(false)}
                              className="flex-1 py-2 rounded font-semibold text-sm border"
                              style={{
                                borderColor: "#C9A46A",
                                color: "#5a3a22",
                              }}
                              data-ocid="admin.cancel_button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {products.length === 0 ? (
                    <p
                      className="text-center py-10 text-sm"
                      style={{ color: "#7a5a3a" }}
                      data-ocid="admin.empty_state"
                    >
                      No products. Add your first product.
                    </p>
                  ) : (
                    <div
                      className="overflow-x-auto rounded-lg shadow-card"
                      style={{ border: "1px solid #e0d0b0" }}
                    >
                      <table className="w-full text-sm">
                        <thead style={{ backgroundColor: "#FAF2E2" }}>
                          <tr>
                            <th
                              className="text-left px-4 py-3"
                              style={{ color: "#3A2A1E" }}
                            >
                              Name
                            </th>
                            <th
                              className="text-left px-4 py-3"
                              style={{ color: "#3A2A1E" }}
                            >
                              Category
                            </th>
                            <th
                              className="text-left px-4 py-3"
                              style={{ color: "#3A2A1E" }}
                            >
                              Price
                            </th>
                            <th
                              className="text-left px-4 py-3"
                              style={{ color: "#3A2A1E" }}
                            >
                              Best Seller
                            </th>
                            <th
                              className="text-left px-4 py-3"
                              style={{ color: "#3A2A1E" }}
                            >
                              Available
                            </th>
                            <th
                              className="text-left px-4 py-3"
                              style={{ color: "#3A2A1E" }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p, idx) => (
                            <tr
                              key={p.id.toString()}
                              className="border-t"
                              style={{ borderColor: "#e0d0b0" }}
                              data-ocid={`admin.row.${idx + 1}`}
                            >
                              <td
                                className="px-4 py-3"
                                style={{ color: "#3A2A1E" }}
                              >
                                {p.name}
                              </td>
                              <td
                                className="px-4 py-3"
                                style={{ color: "#5a3a22" }}
                              >
                                {p.category}
                              </td>
                              <td
                                className="px-4 py-3"
                                style={{ color: "#A95512" }}
                              >
                                ₹{(Number(p.price) / 100).toFixed(0)}
                              </td>
                              <td className="px-4 py-3">
                                {p.isBestSeller ? "⭐ Yes" : "No"}
                              </td>
                              <td className="px-4 py-3">
                                {p.isAvailable ? "✅ Yes" : "❌ No"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openEditProduct(p)}
                                    className="p-1.5 rounded"
                                    style={{ color: "#A95512" }}
                                    data-ocid={`admin.edit_button.${idx + 1}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 rounded"
                                    style={{ color: "#c0392b" }}
                                    data-ocid={`admin.delete_button.${idx + 1}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: "#3A2A1E" }}
                  >
                    Orders ({orders.length})
                  </h3>
                  {orders.length === 0 ? (
                    <p
                      className="text-center py-10 text-sm"
                      style={{ color: "#7a5a3a" }}
                      data-ocid="admin.empty_state"
                    >
                      No orders yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, idx) => (
                        <div
                          key={order.id.toString()}
                          className="rounded-lg p-5 shadow-card"
                          style={{
                            backgroundColor: "#FAF2E2",
                            border: "1px solid #e0d0b0",
                          }}
                          data-ocid={`admin.row.${idx + 1}`}
                        >
                          <div className="flex flex-wrap justify-between gap-3 mb-3">
                            <div>
                              <p
                                className="font-bold"
                                style={{ color: "#3A2A1E" }}
                              >
                                Order #{order.id.toString()} —{" "}
                                {order.customerName}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "#7a5a3a" }}
                              >
                                {order.phone} · {order.address}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="font-bold"
                                style={{ color: "#A95512" }}
                              >
                                ₹{(Number(order.totalAmount) / 100).toFixed(0)}
                              </span>
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleUpdateStatus(
                                    order.id,
                                    e.target.value as OrderStatus,
                                  )
                                }
                                className="px-2 py-1 rounded border text-xs"
                                style={{
                                  borderColor: "#C9A46A",
                                  backgroundColor: "#F4E9D2",
                                }}
                                data-ocid={`admin.select.${idx + 1}`}
                              >
                                {Object.values(OrderStatus).map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div
                            className="text-xs space-y-1"
                            style={{ color: "#5a3a22" }}
                          >
                            {order.items.map((item) => (
                              <p key={`${item.productId}-${item.quantity}`}>
                                {item.productName} × {item.quantity.toString()}{" "}
                                @ ₹{(Number(item.price) / 100).toFixed(0)}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Contacts Tab */}
                <TabsContent value="contacts">
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: "#3A2A1E" }}
                  >
                    Contact Queries ({contacts.length})
                  </h3>
                  {contacts.length === 0 ? (
                    <p
                      className="text-center py-10 text-sm"
                      style={{ color: "#7a5a3a" }}
                      data-ocid="admin.empty_state"
                    >
                      No contact queries yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {contacts.map((c, idx) => (
                        <div
                          key={c.id.toString()}
                          className="rounded-lg p-5 shadow-card"
                          style={{
                            backgroundColor: "#FAF2E2",
                            border: "1px solid #e0d0b0",
                          }}
                          data-ocid={`admin.row.${idx + 1}`}
                        >
                          <div className="flex justify-between mb-1">
                            <p
                              className="font-bold text-sm"
                              style={{ color: "#3A2A1E" }}
                            >
                              {c.name}
                            </p>
                            <p className="text-xs" style={{ color: "#7a5a3a" }}>
                              {c.email}
                            </p>
                          </div>
                          <p className="text-sm" style={{ color: "#5a3a22" }}>
                            {c.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
