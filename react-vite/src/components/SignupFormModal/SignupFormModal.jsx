import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
        address,
        city,
        state,
        zip
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
		<>
			<h1>Sign Up</h1>
			{errors.server && <p>{errors.server}</p>}
			<label>
				First Name
				<input
					type='text'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					required
				/>
			</label>
			{errors.firstName && <p>{errors.firstName}</p>}
			<label>
				Last Name
				<input
					type='text'
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
				/>
			</label>
			{errors.lastName && <p>{errors.lastName}</p>}
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input
						type='text'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				{errors.email && <p>{errors.email}</p>}
				<label>
					Phone Number
					<input
						type='text'
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						required
					/>
				</label>
				{errors.phoneNumber && <p>{errors.phoneNumber}</p>}
				<label>
					Address
					<input
						type='text'
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						required
					/>
				</label>
				{errors.address && <p>{errors.address}</p>}
				<label>
					City
					<input
						type='text'
						value={city}
						onChange={(e) => setCity(e.target.value)}
						required
					/>
				</label>
				{errors.city && <p>{errors.city}</p>}
				<label>
					State
					<input
						type='text'
						value={state}
						onChange={(e) => setState(e.target.value)}
						required
					/>
				</label>
				{errors.state && <p>{errors.state}</p>}
				<label>
					Zip Code
					<input
						type='text'
						value={zip}
						onChange={(e) => setZip(e.target.value)}
						required
					/>
				</label>
				{errors.zip && <p>{errors.zip}</p>}
				<label>
					Password
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				{errors.password && <p>{errors.password}</p>}
				<label>
					Confirm Password
					<input
						type='password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				{errors.confirmPassword && <p>{errors.confirmPassword}</p>}
				<button className='auth-buttons' type='submit'>
					Sign Up
				</button>
			</form>
		</>
  );
}

export default SignupFormModal;
