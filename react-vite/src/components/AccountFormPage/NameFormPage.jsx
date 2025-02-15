import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {editUserThunk} from "../../redux/session"
import { setError } from "../../redux/errors";

function NameFormPage(){
    const user = useSelector((store) => store.session.user);
    const [firstName, setFirstName] = useState(user?.firstName);
    const [lastName, setLastName] = useState(user?.lastName);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    if(!user) navigate('/login')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const submitObj = {
            id: user.id,
            first_name: firstName
        }
        if(lastName) submitObj.last_name = lastName

        const server = await dispatch(editUserThunk(submitObj))
        if(server){
            return setError({firstName: server})
        } else {
            navigate('/account')
        }
    }

    return (
			<div>
				<h1>Name</h1>
				This is the name you would like other people to use when referring
				to you
				<form onSubmit={(e) => handleSubmit(e)}>
					<label>
						First Name
						<input
							type='text'
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							required
						/>
					</label>
					<label>
						Last Name
						<input
							type='text'
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</label>
					<button
						className='auth-buttons'
						onClick={(e) => handleSubmit(e)}>
						Update
					</button>
				</form>
			</div>
		);
}

export default NameFormPage;