"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ====== THÔNG TIN NGÂN HÀNG (chỉnh ở đây) ======
// Mã ngân hàng theo chuẩn VietQR, ví dụ:
//   Vietcombank = "VCB", Techcombank = "TCB", MBBank = "MB",
//   ACB = "ACB", BIDV = "BIDV", VietinBank = "ICB", VPBank = "VPB",
//   Agribank = "VBA", Sacombank = "STB", TPBank = "TPB", MoMo = "MOMO" ...
// Danh sách đầy đủ: https://api.vietqr.io/v2/banks
const BANK = {
  bankCode: "VCB", // mã ngân hàng
  accountNumber: "0123456789", // số tài khoản của bạn
  accountName: "NGUYEN VAN A", // tên chủ tài khoản (IN HOA, không dấu)
  message: "Mung sinh nhat nhe", // nội dung chuyển khoản gợi ý
  // amount: 50000,            // (tùy chọn) số tiền cố định, bỏ comment nếu muốn
};
// ===============================================

// Tạo link ảnh QR động từ VietQR (quét được bằng app ngân hàng / MoMo)
function buildQrUrl() {
  const base = `https://img.vietqr.io/image/${BANK.bankCode}-${BANK.accountNumber}-compact2.png`;
  const params = new URLSearchParams({
    accountName: BANK.accountName,
    addInfo: BANK.message,
  });
  // @ts-expect-error: amount là tùy chọn
  if (BANK.amount) params.set("amount", String(BANK.amount));
  return `${base}?${params.toString()}`;
}

export default function QRGift() {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 px-6 py-3 font-bold text-white shadow-lg"
      >
        Lì xì cho mình nha 🧧
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] rounded-3xl bg-white p-6 text-center shadow-2xl"
            >
              <h2 className="mb-1 text-xl font-extrabold text-rose-600">
                Quét để lì xì 🧧
              </h2>
              <p className="mb-4 text-xs text-gray-500">
                Mở app ngân hàng / MoMo và quét mã nhé. Cảm ơn nhiều 🥰
              </p>

              <div className="mx-auto mb-4 w-full overflow-hidden rounded-2xl border-4 border-amber-200 bg-white">
                {!imgError ? (
                  <Image
                    src={buildQrUrl()}
                    alt="Mã QR chuyển khoản"
                    width={320}
                    height={400}
                    className="h-auto w-full object-contain"
                    onError={() => setImgError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-sm text-gray-500">
                    <span className="mb-2 text-4xl">📵</span>
                    Không tải được mã QR. Kiểm tra lại thông tin ngân hàng trong{" "}
                    <code>components/QRGift.tsx</code>.
                  </div>
                )}
              </div>

              <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-left text-sm">
                <p>
                  <span className="text-gray-500">Ngân hàng:</span>{" "}
                  <b>{BANK.bankCode}</b>
                </p>
                <p>
                  <span className="text-gray-500">Số TK:</span>{" "}
                  <b>{BANK.accountNumber}</b>
                </p>
                <p>
                  <span className="text-gray-500">Chủ TK:</span>{" "}
                  <b>{BANK.accountName}</b>
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl bg-gray-100 px-6 py-3 font-bold text-gray-600"
              >
                Đóng lại
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
