"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CompanyDetail() {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState(null);

  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const [editModal, setEditModal] = useState({
    open: false,
    product: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
  });

  // DATE FORMAT
const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  // +3 saat ekleme
  d.setHours(d.getHours() + 3);

  return d.toLocaleString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  // FETCH COMPANY
  const fetchCompany = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Firma bilgisi alınamadı");
      return;
    }

    setCompany(data);
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("company_id", id)
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Ürünler yüklenemedi");
      return;
    }

    setProducts(data || []);
  };

  useEffect(() => {
    if (!id) return;
    fetchCompany();
    fetchProducts();
  }, [id]);

  // ADD
  const addProduct = async () => {
    if (!name.trim()) {
      toast.error("Ürün adı boş olamaz");
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        company_id: id,
        name,
        note,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      toast.error("Ürün eklenemedi");
      return;
    }

    toast.success("Ürün eklendi");

    setName("");
    setNote("");
    fetchProducts();
  };

  // UPDATE
  const updateProduct = async () => {
    const { product } = editModal;
    if (!product) return;

    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        note: product.note,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (error) {
      toast.error("Güncelleme başarısız");
      return;
    }

    toast.success("Ürün güncellendi");

    setEditModal({ open: false, product: null });
    fetchProducts();
  };

  // DELETE
  const deleteProduct = async () => {
    const { error } = await supabase
      .from("products")
      .update({ archived: true })
      .eq("id", deleteModal.id);

    if (error) {
      toast.error("Arşive taşıma işlemi başarısız");
      return;
    }

    toast.success("Ürün Arşive Taşındı");

    setDeleteModal({ open: false, id: null });
    fetchProducts();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 p-8 text-white"
    >
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wide">
          {company ? company.name : "Yükleniyor..."}
        </h1>
        <p className="text-sm text-blue-300">
          Firma ürün & not yönetimi
        </p>
      </div>
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">
    {company?.name}
  </h1>

  <Link
    href={`/companies/${id}/archive`}
    className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded hover:bg-yellow-500/30"
  >
    📦 Arşiv
  </Link>
</div>

      {/* ADD */}
      <div className="bg-blue-900/40 border border-blue-800 rounded-2xl p-5 shadow-lg mb-6 backdrop-blur-md">
        <h2 className="text-sm font-semibold text-blue-200 mb-3">
          Yeni Ürün Ekle
        </h2>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ürün adı"
            className="w-full bg-blue-950/40 border border-blue-800 text-white placeholder-blue-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Not"
            className="w-full bg-blue-950/40 border border-blue-800 text-white placeholder-blue-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2 rounded-lg shadow-md"
          >
            Ekle
          </motion.button>
        </div>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-blue-900/40 border border-blue-800 rounded-2xl p-4 shadow-md backdrop-blur-md"
            >
              <h3 className="font-semibold text-white">{p.name}</h3>
              <p className="text-sm text-blue-200 mt-1">{p.note}</p>

              {/* DATES */}
              <div className="mt-3 text-[11px] text-blue-300 space-y-1 border-t border-blue-800 pt-2">
                <p>📅 Oluşturuldu: {formatDate(p.created_at)}</p>

                {p.updated_at && p.updated_at !== p.created_at && (
                  <p>✏️ Güncellendi: {formatDate(p.updated_at)}</p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() =>
                    setEditModal({ open: true, product: { ...p } })
                  }
                  className="text-xs px-3 py-1 rounded bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                >
                  Düzenle
                </button>

                <button
                  onClick={() =>
                    setDeleteModal({ open: true, id: p.id })
                  }
                  className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"
                >
                  Arşive Taşı
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editModal.open && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <motion.div className="bg-blue-950 border border-blue-800 w-full max-w-md rounded-2xl p-6 text-white">
              <h2 className="font-semibold mb-4">Ürün Düzenle</h2>

              <input
                value={editModal.product?.name || ""}
                onChange={(e) =>
                  setEditModal((prev) => ({
                    ...prev,
                    product: {
                      ...prev.product,
                      name: e.target.value,
                    },
                  }))
                }
                className="w-full mb-2 bg-blue-900/40 border border-blue-700 p-2 rounded"
              />

              <textarea
                value={editModal.product?.note || ""}
                onChange={(e) =>
                  setEditModal((prev) => ({
                    ...prev,
                    product: {
                      ...prev.product,
                      note: e.target.value,
                    },
                  }))
                }
                className="w-full bg-blue-900/40 border border-blue-700 p-2 rounded"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() =>
                    setEditModal({ open: false, product: null })
                  }
                  className="px-3 py-1 bg-gray-700 rounded"
                >
                  İptal
                </button>

                <button
                  onClick={updateProduct}
                  className="px-3 py-1 bg-blue-500 rounded"
                >
                  Kaydet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <motion.div className="bg-blue-950 border border-blue-800 p-6 rounded-2xl w-80 text-white">
              <h2 className="mb-4 font-semibold">
                Arşive taşımak istediğine emin misin?
              </h2>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    setDeleteModal({ open: false, id: null })
                  }
                  className="px-3 py-1 bg-gray-700 rounded"
                >
                  Vazgeç
                </button>

                <button
                  onClick={deleteProduct}
                  className="px-3 py-1 bg-red-500 rounded"
                >
                  Arşive Taşı
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}