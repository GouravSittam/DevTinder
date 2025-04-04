import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoURL, age, gender, about, skills } = user;
  //   console.log(user);

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img src={user?.photoURL} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + "," + gender}</p>}
        <p>{about}</p>
        <p>{skills}</p>
        <div className="card-actions justify-center my-4">
          <button className="btn btn-secondary">Ignore</button>
          <button className="btn btn-primary">Intrested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
