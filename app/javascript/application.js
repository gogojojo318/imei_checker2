import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener("DOMContentLoaded", () => {
  const imeiInput = document.getElementById("imei");
  const submitBtn = document.getElementById("submitBtn");
  const error = document.getElementById("error");
  const loading = document.getElementById("loading");
  const form = document.querySelector("form");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");
  const toast = document.getElementById("toast");
  const result = document.getElementById("result");

  // 必須要素がなければ何もしない（エラー防止）
  if (!imeiInput || !submitBtn || !form) return;

  /* =========================
     入力チェック
  ========================= */
  imeiInput.addEventListener("input", () => {
    imeiInput.value = imeiInput.value.replace(/\D/g, "");
    const isValid = imeiInput.value.length === 15;

    submitBtn.disabled = !isValid;
    if (error) error.classList.toggle("hidden", isValid);

    if (isValid) {
      submitBtn.classList.remove("bg-gray-400");
      submitBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
    } else {
      submitBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
      submitBtn.classList.add("bg-gray-400");
    }
  });

  /* =========================
     送信処理（これ1つだけ）
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    if (loading) loading.classList.remove("hidden");
    if (result) result.classList.add("hidden");

    try {
      const res = await fetch("/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document
            .querySelector("meta[name='csrf-token']")
            ?.content
        },
        body: JSON.stringify({ imei: imeiInput.value })
      });

      if (!res.ok) throw new Error("通信エラー");

      const data = await res.json();

      // 結果表示（存在チェック付き）
      Object.entries(data).forEach(([key, value]) => {
        const el = document.getElementById(key);
        if (el) el.textContent = value;
      });

      if (result) result.classList.remove("hidden");

    } catch (err) {
      console.error(err);
      if (error) {
        error.textContent = "エラーが発生しました";
        error.classList.remove("hidden");
      }
    } finally {
      if (loading) loading.classList.add("hidden");
      submitBtn.disabled = false;
    }
  });

  /* =========================
     クリア
  ========================= */
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      imeiInput.value = "";
      submitBtn.disabled = true;
      if (error) error.classList.add("hidden");
      if (result) result.classList.add("hidden");
      imeiInput.focus();
    });
  }

  /* =========================
     コピー
  ========================= */
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      if (!imeiInput.value) return;

      try {
        await navigator.clipboard.writeText(imeiInput.value);
        if (toast) {
          toast.classList.remove("opacity-0");
          toast.classList.add("opacity-100");

          setTimeout(() => {
            toast.classList.remove("opacity-100");
            toast.classList.add("opacity-0");
          }, 2000);
        }
      } catch {
        if (toast) {
          toast.textContent = "コピーに失敗しました";
          toast.classList.remove("opacity-0");
        }
      }
    });
  }
});
