"use client";

import { useEffect } from "react";
import { Todo } from "@/types/todo";

export default function NotificationManager({ todos }: { todos: Todo[] }) {
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    function check() {
      if (Notification.permission !== "granted") return;
      const now = new Date();
      const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

      todos.forEach((todo) => {
        if (todo.completed || !todo.due_date) return;

        const due = new Date(todo.due_date);
        if (todo.due_time) {
          const [h, m] = todo.due_time.split(":");
          due.setHours(Number(h), Number(m), 0, 0);
        } else {
          due.setHours(23, 59, 0, 0);
        }

        if (due > now && due <= inOneHour) {
          const key = `sf_notified_${todo.id}_${todo.due_date}`;
          if (!localStorage.getItem(key)) {
            const diffMin = Math.round((due.getTime() - now.getTime()) / 60000);
            new Notification("📅 일정 알림", {
              body: `${todo.title} — ${diffMin}분 후 마감`,
              icon: "/favicon.ico",
            });
            localStorage.setItem(key, "1");
          }
        }
      });
    }

    check();
    const id = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [todos]);

  return null;
}
