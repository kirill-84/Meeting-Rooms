// app/test-telegram/page.tsx
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

export default function TestTelegram() {
  useEffect(() => {
    // Callback когда пользователь авторизуется
    window.onTelegramAuth = (user) => {
      alert("Telegram auth data: " + JSON.stringify(user, null, 2));
      console.log("Telegram user:", user);
    };
  }, []);

  useEffect(() => {
    // Загружаем скрипт виджета
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "RoomCoordBot"); // замените!
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    
    document.getElementById("telegram-button")?.appendChild(script);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Telegram Widget Test</h1>
      <div id="telegram-button"></div>
    </div>
  );
}
