import { useModal } from './Modal.jsx';
import { useState, useEffect, useCallback } from 'react';
import './TipModal.css'

export default function TipModal({ orderTotal, setTip, setCustomTipUsed }) {
	const { closeModal } = useModal();
	const [customTip, setCustomTip] = useState('');

	const handleSaveTip = useCallback(() => {
		const tipAmount = parseFloat(customTip) || 0;
		setTip(tipAmount);
		setCustomTipUsed(true);
		closeModal();
	}, [customTip, setTip, setCustomTipUsed, closeModal]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Enter' && customTip !== '') {
				handleSaveTip();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [customTip, handleSaveTip]);

	return (
		<div className='tip-modal'>
			<div className='modal-header'>
				<div className='close-button' onClick={closeModal}>
					×
				</div>
				<h2>Enter other amount</h2>
			</div>
			<div className='input-container'>
				<span className='dollar-sign'>$</span>
				<input
					type='number'
					value={customTip}
					onChange={(e) => setCustomTip(e.target.value)}
					placeholder='0'
					min='0'
					inputMode='decimal'
				/>
			</div>
			<p>Your order is ${orderTotal?.toFixed(2) || '0.00'}</p>
			<button
				onClick={handleSaveTip}
				disabled={customTip === ''}
				className={
					!customTip || parseFloat(customTip) <= 0 ? 'disabled-button' : ''
				}>
				Save
			</button>
		</div>
	);
}
