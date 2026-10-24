"use strict";

/*
 * Zivelle Customer Assistant
 * This is a demo assistant with predefined replies.
 * Real AI requires a secure backend and an AI API key.
 */

document.addEventListener("DOMContentLoaded", function () {
  const chatToggle = document.getElementById("chatToggle");
  const chatPanel = document.getElementById("chatPanel");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  if (!chatToggle || !chatPanel || !chatForm || !chatInput || !chatMessages) {
    console.warn("Zivelle chat elements were not found in index.html.");
    return;
  }

  function addMessage(message, sender) {
    const element = document.createElement("div");
    element.className = "chat-message " + sender;
    element.textContent = message;
    chatMessages.appendChild(element);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getReply(message) {
    const text = message.toLowerCase().trim();

    if (/^(hi|hello|hey|হাই|হ্যালো|আসসালামু আলাইকুম)/i.test(text)) {
      return "Hello! Welcome to Zivelle 🌸 How can I help you today?";
    }

    if (/price|দাম|মূল্য|কত টাকা/i.test(text)) {
      return "আপনি কোন পণ্যটির দাম জানতে চান? Shop section থেকে পণ্যটি বেছে নিন।";
    }

    if (/delivery|ডেলিভারি|কুরিয়ার|কুরিয়ার/i.test(text)) {
      return "ডেলিভারি সম্পর্কে জানতে আপনার এলাকা এবং পণ্যের নাম আমাদের জানান।";
    }

    if (/order|অর্ডার|কিনতে চাই|কিনব/i.test(text)) {
      return "পছন্দের পণ্যটি Cart-এ যোগ করুন। এরপর Checkout থেকে অর্ডার দেওয়ার চেষ্টা করুন।";
    }

    if (/return|exchange|refund|ফেরত|বদল/i.test(text)) {
      return "পণ্য ফেরত বা পরিবর্তনের নিয়ম জানতে আমাদের Customer Support-এর সঙ্গে যোগাযোগ করুন।";
    }

    if (/contact|যোগাযোগ|ফোন|নম্বর/i.test(text)) {
      return "যোগাযোগের তথ্য জানতে আমাদের ওয়েবসাইটের Contact section দেখুন।";
    }

    if (/thank|ধন্যবাদ/i.test(text)) {
      return "You're welcome! Thank you for choosing Zivelle 💗";
    }

    return "ধন্যবাদ আপনার মেসেজের জন্য! 🌸 পণ্য, দাম বা অর্ডার সম্পর্কে জানতে আপনার প্রশ্নটি আরেকটু বিস্তারিত লিখুন। প্রয়োজনে Customer Support-এর সঙ্গে যোগাযোগ করুন।";
  }

  chatToggle.addEventListener("click", function () {
    const isOpen = chatPanel.classList.toggle("open");
    chatToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen && chatMessages.children.length === 0) {
      addMessage(
        "Hello! Welcome to Zivelle 🌸 আপনার কী সাহায্য প্রয়োজন?",
        "bot"
      );
    }

    if (isOpen) chatInput.focus();
  });

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    chatInput.value = "";

    window.setTimeout(function () {
      addMessage(getReply(message), "bot");
    }, 450);
  });
});
