import { useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowFriend] = useState(false);
  const [selectedF, setSelectedF] = useState(null);

  function toogleShowAddFriend() {
    setShowFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowFriend((e) => !e);
  }

  function handleSelection(friend) {
    setSelectedF((selected) => (selected?.id === friend.id ? null : friend));
    setShowFriend(false);
  }

  function handleBillSplit(value) {
    setFriends((friends) =>
      friends.map(
        (friend) =>
          friend.id === selectedF.id
            ? { ...friend, balance: friend.balance + value }
            : friend //haaaaaaaaaaaaaaa i had a stroke understanding this function
      )
    );
    setSelectedF(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedF={selectedF}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={toogleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedF && (
        <FormSplitBill
          selectedF={selectedF}
          onSplitBill={handleBillSplit}
          key={selectedF.id}
          //updated stuff, writing this idk why but it will add to the git add .
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onSelection, selectedF }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedF={selectedF}
          id={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedF }) {
  const isSelected = selectedF && friend.id === selectedF.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even!</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [newFriend, setNewFriend] = useState("");
  const [image, setNewImg] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();

    if (!newFriend || !image) return;

    const id = crypto.randomUUID();
    const newF = {
      id,
      name: newFriend,
      image: `${image}?u=${id}`, //this appends the id into the newImg string
      balance: 0,
    };
    // console.log(newF);

    onAddFriend(newF);
    setNewFriend("");
    setNewImg("https://i.pravatar.cc/48?u=499476");
  }

  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>🧑‍🤝‍🧑Friend name </label>
      <input
        type="text"
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
      />

      <label>🌅Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setNewImg(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedF, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userPaid, setUserPaid] = useState("");
  const paidByFriend = bill ? bill - userPaid : "";
  const [whosTheDaddyTonight, setWhosTheDaddyTonight] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userPaid) return;
    onSplitBill(whosTheDaddyTonight === "user" ? paidByFriend : -userPaid);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedF.name}</h2>

      <label>💰Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🦍Your expense</label>
      <input
        type="number"
        value={userPaid}
        onChange={(e) =>
          setUserPaid(+e.target.value > bill ? userPaid : +e.target.value)
        }
      />

      <label>😼{selectedF.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who is paying the bill</label>
      <select
        value={whosTheDaddyTonight}
        onChange={(e) => setWhosTheDaddyTonight(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedF.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
