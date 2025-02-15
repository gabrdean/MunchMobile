import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {editUserThunk} from "../../redux/session"


function EmailPage(){
    const user = useSelector((store) => store.session.user);
    const [email, setEmail] = useState(user?.email);
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()

    if(!user) navigate('/login')

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setErrors({})

        if(!email.includes('@')){
            return setErrors({email: "Email must include @"})
        }
        else if (!email.split('@')[1].includes('.')){
            return setErrors({email: 'Email must include an "."'})
        }


        const server = await dispatch(editUserThunk({email, id: user.id}))
        if(server){
            return setErrors({email: server})
        } else {
            navigate('/account')
        }
    }

    return (
			<div>
				<h1>Email</h1>
				{"You'll use this number sign in"}
				<input
					type='text'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{errors && <p>{errors.email}</p>}
				<button className='auth-buttons' onClick={(e) => handleSubmit(e)}>
					Update
				</button>
			</div>
		);

}

export default EmailPage