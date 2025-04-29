import React, { useEffect, useState } from 'react'
import './ListUser.css'
import cross_icon from '../../assets/cross_icon.png'

const ListUser = () => {

    const [allusers, setAllUsers] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/api/users/allusers')
            .then((res) => res.json())
            .then((data) => { setAllUsers(data) });
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    const remove_user = async (id) => {
        await fetch('http://localhost:4000/api/users/removeuser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        await fetchInfo();
    }

    return (
        <div className='list-user'>
            <h1>All Users List</h1>
            <div className="listuser-format-main">
                <p>No.</p>
                <p>Name</p>
                <p>Email</p>
                <p>Remove</p>
            </div>
            <div className="listuser-allusers">
                <hr />
                {allusers.map((user, index) => {
                    return <>
                        <div key={user._id} className="listuser-format-main listuser-format">
                            <p>{index + 1}</p>
                            <p>{user.name}</p>
                            <p>{user.email}</p>
                            <img onClick={() => { remove_user(user._id) }} className='listuser-remove-icon' src={cross_icon} alt="" />
                        </div>
                        <hr />
                    </>
                })}
            </div>
        </div>
    )
}

export default ListUser
