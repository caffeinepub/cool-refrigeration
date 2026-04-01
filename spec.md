# Cool Refrigeration

## Current State
The site has a one-way floating chat widget (bottom-right). Customers can send a name + message which is stored in the backend and notified via WhatsApp to the owner. The admin panel has a Messages tab where the owner can view all chat messages. There is no two-way chat capability, no reply from owner back to customer visible on the site, and no dedicated chat section on the page.

Backend currently supports:
- `sendChatMessage(name, message) -> boolean`
- `getAllChatMessages() -> Array<ChatMessage>`
ChatMessage has: id, name, message, timestamp

## Requested Changes (Diff)

### Add
- `reply: opt Text` field to ChatMessage in the backend
- `replyToChat(id: Nat, reply: Text) -> Bool` backend method
- A session ID (generated client-side, stored in localStorage) attached to each chat message so the widget can poll only that customer's messages
- `getChatMessagesBySession(sessionId: Text) -> Array<ChatMessage>` backend method
- Two-way chat in the floating widget: shows the conversation thread (customer messages + owner replies), auto-polls every 5s for replies after sending
- A dedicated "Chat With Us" section on the main page (above the footer), showing the same chat interface embedded inline
- Admin panel: reply input box next to each message so owner can type and send a reply; replied messages show a green checkmark

### Modify
- Existing `sendChatMessage` to accept a sessionId parameter: `sendChatMessage(name, sessionId, message) -> Bool`
- ChatMessage struct to include `sessionId: Text` and `reply: opt Text`

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate Motoko backend with updated ChatMessage struct and new methods
2. Update floating chat widget: session ID, conversation thread view, 5s polling for replies
3. Add dedicated chat section on the landing page (above footer)
4. Update admin panel Messages tab: show reply input, submit reply via replyToChat, show replied status
