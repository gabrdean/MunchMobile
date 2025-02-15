// import OpenModalButton from '../OpenModalButton/OpenModalButton';
// import devInfo from './devInfo';

// function FooterButton({ dev }) {

//   let cDev = {github: null, linkedIn: null, discord: null}
//   if(!dev) return null
//   else if(dev === "Gabe") cDev = devInfo.Gabe
//   else if(dev === "Burak") cDev = devInfo.Burak
//   else if(dev === "Katie") cDev = devInfo.Katie
//   else if(dev === "Marcellies") cDev = devInfo.Marcellies
//   else if(dev === "Sama") cDev = devInfo.Sama

//   // console.log("DEV ", dev)
//   // console.log("DEVINFO ", devInfo.dev)

//   let content = null
//   if(dev && cDev){
//     content = (
//       <div className="dev-info">
  
//         <label className='github'>
//           Git-Hub:
//           <button onClick={()=> {
//             navigator.clipboard.writeText(cDev.github)
//               .then(()=> alert('Git-Hub URL copied to clipboard!'))
//               .catch((err)=> console.error('Faled to copy text: ', err))
//           }}>
//             {cDev.github}
//           </button>
//         </label>
  
//         <label className='linkedIn'>
//           LinkedIn
//           <button onClick={()=> {
//             navigator.clipboard.writeText(cDev.linkedIn)
//               .then(()=> alert('LinkedIn URL copied to clipboard!'))
//               .catch((err)=> console.error('Faled to copy text: ', err))
//           }}>
//             {cDev.linkedIn}
//           </button>
//         </label>
  
//         <label className='discord'>
//           Discord Tag
//           <button onClick={()=> {
//             navigator.clipboard.writeText(cDev.discord)
//               .then(()=> alert('Discord Tag copied to clipboard!'))
//               .catch((err)=> console.error('Faled to copy text: ', err))
//           }}>
//             {cDev.discord}
//           </button>
//         </label>
        
//       </div>
//     ) 
//   }
  

//   return (
//     <OpenModalButton
//       buttonText={dev}
//       modalComponent={content}
//     />
//   );
// }

// export default FooterButton