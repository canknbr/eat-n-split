import React, { useState } from "react";
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

const App = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const handleShowFriend = () => {
    setShowAddFriend(!showAddFriend);
  };
  const handleAddFriend = (newFriend) => {
    setFriends([...friends, newFriend]);
    setShowAddFriend(false);
  };
  const handleSelectFriend = (friend) => {
    if (selectedFriend && selectedFriend.id === friend.id) {
      setSelectedFriend(null);
    } else {
      setSelectedFriend(friend);
    }
    setShowAddFriend(false);
  };
  const handleSplitBill = (value) => {
    setFriends((oldFriends) =>
      oldFriends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelectFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          onSplitBill={handleSplitBill}
          selectedFriend={selectedFriend}
        />
      )}
    </div>
  );
};

const FriendList = ({ friends, onSelection, selectedFriend }) => {
  return (
    <ul className="">
      {friends.map((friend) => {
        return (
          <Friend
            key={friend.id}
            friend={friend}
            selectedFriend={selectedFriend}
            onSelection={onSelection}
          />
        );
      })}
    </ul>
  );
};
const Friend = ({ friend, onSelection, selectedFriend }) => {
  const isSelected = selectedFriend && selectedFriend.id === friend.id;
  const { name, image, balance, id } = friend;
  return (
    <li className={isSelected && "selected"}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {balance < 0 && (
        <p className="red">
          You owe {name} {Math.abs(balance)}$
        </p>
      )}
      {balance > 0 && (
        <p className="green">
          {name} owes you {Math.abs(balance)}$
        </p>
      )}
      {balance === 0 && <p className="red">You and {name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};
const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};
const FormAddFriend = ({ onAddFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;
    const id = new Date().getTime().toString();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />

      <label>Image Url</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      />
      <Button>Add</Button>
    </form>
  );
};
const FormSplitBill = ({ selectedFriend, onSplitBill }) => {
  const [billValue, setBillValue] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = billValue ? billValue - paidByUser : "";
  const [whoPaid, setWhoPaid] = useState("user");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!billValue || !paidByUser) return;
    onSplitBill(whoPaid === "user" ? paidByFriend : -paidByUser);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(+e.target.value)}
      />
      <label>Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(+e.target.value) > billValue
            ? paidByUser
            : +e.target.value
        }
      />
      <label>{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>Who is paying the bill</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split</Button>
    </form>
  );
};
export default App;
