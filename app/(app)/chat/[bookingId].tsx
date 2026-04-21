import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  sender: "me" | "specialist";
  time: string;
  status?: "sent" | "delivered" | "read";
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hello! I'm John, your plumbing specialist for today.",
    sender: "specialist",
    time: "2:30 PM",
  },
  {
    id: "2",
    text: "I've just arrived at the location. Are you available?",
    sender: "specialist",
    time: "2:31 PM",
  },
  {
    id: "3",
    text: "Hi John! Yes, I'm at home. The door is open, you can come in.",
    sender: "me",
    time: "2:33 PM",
    status: "read",
  },
  {
    id: "4",
    text: "Perfect. I'll head up now. I have the replacement parts for the leaky faucet.",
    sender: "specialist",
    time: "2:34 PM",
  },
];

const MessageItem = React.memo(({ item }: { item: Message }) => {
  const isMe = item.sender === "me";
  return (
    <View style={[ss.messageRow, isMe ? ss.myMessageRow : ss.theirMessageRow]}>
      {!isMe && (
        <Image
          source={{ uri: "https://i.pravatar.cc/150?u=john" }}
          style={ss.chatAvatar}
        />
      )}
      <View style={[ss.bubble, isMe ? ss.myBubble : ss.theirBubble]}>
        <Text
          style={[
            ss.messageText,
            isMe ? ss.myMessageText : ss.theirMessageText,
          ]}
        >
          {item.text}
        </Text>
        <View style={ss.messageFooter}>
          <Text style={[ss.messageTime, isMe ? ss.myTime : ss.theirTime]}>
            {item.time}
          </Text>
          {isMe && (
            <Ionicons
              name={item.status === "read" ? "checkmark-done" : "checkmark"}
              size={14}
              color="rgba(255,255,255,0.7)"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    </View>
  );
});

MessageItem.displayName = "MessageItem";

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>(MOCK_MESSAGES);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };
    haptic.tap();
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <SafeAreaView style={ss.safe}>
      <View style={ss.header}>
        <TouchableOpacity onPress={() => router.back()} style={ss.headerAction}>
          <Feather
            name="chevron-left"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <View style={ss.headerInfo}>
          <Text style={ss.headerName}>John Smith</Text>
          <View style={ss.statusRow}>
            <View style={ss.onlineDot} />
            <Text style={ss.statusText}>Plumbing Specialist</Text>
          </View>
        </View>

        <TouchableOpacity style={ss.headerAction}>
          <Feather name="phone" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={ss.contextRibbon}>
        <View style={ss.contextIcon}>
          <MaterialCommunityIcons
            name="pipe"
            size={18}
            color={theme.colors.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ss.contextTitle}>Leaky Faucet Repair</Text>
          <Text style={ss.contextSub}>Today • 2:30 PM • #BK-9921</Text>
        </View>
        <TouchableOpacity style={ss.contextAction}>
          <Text style={ss.contextActionText}>Details</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1 }}>
          <FlashList
            data={[...chatHistory].reverse()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageItem item={item} />}
            contentContainerStyle={ss.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={ss.inputContainer}>
          <TouchableOpacity style={ss.attachBtn}>
            <Feather name="plus" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <View style={ss.textInputWrapper}>
            <TextInput
              style={ss.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[ss.sendBtn, !message.trim() && { opacity: 0.6 }]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerAction: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: { flex: 1, alignItems: "center" },
  headerName: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  statusText: { fontSize: 12, color: theme.colors.textMuted },

  contextRibbon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 12,
    padding: 12,
    borderRadius: 16,
    ...theme.shadows.small,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  contextIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  contextTitle: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  contextSub: { fontSize: 11, color: theme.colors.textMuted, marginTop: 1 },
  contextAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  contextActionText: {
    fontSize: 11,
    color: theme.colors.textPrimary,
  },

  listContent: { padding: 16, paddingBottom: 20 },
  messageRow: { flexDirection: "row", marginBottom: 16, maxWidth: "80%" },
  myMessageRow: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  theirMessageRow: { alignSelf: "flex-start" },

  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },

  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  myBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    ...theme.shadows.small,
  },

  messageText: { fontSize: 14, lineHeight: 20 },
  myMessageText: { color: "#fff" },
  theirMessageText: { color: theme.colors.textPrimary },

  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  messageTime: { fontSize: 10 },
  myTime: { color: "rgba(255,255,255,0.7)" },
  theirTime: { color: theme.colors.textMuted },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 8,
  },
  attachBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 22,
    paddingHorizontal: 16,
    maxHeight: 100,
    justifyContent: "center",
  },
  input: {
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
