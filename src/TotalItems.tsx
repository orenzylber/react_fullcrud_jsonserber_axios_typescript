import React, { useState, useEffect } from 'react'

interface Props {
  cart: { id: number, desc: string, price: number, qty: number }[],
  updCart: boolean
}

const TotalItems: React.FC<Props> = (props) => {
    console.table(props.cart)
    const [Total, setTotal] = useState(0)
    useEffect(() => {
        let temp = 0
        console.log("Total Items Updated")
        props.cart.forEach(element => {
            temp += element.qty
        });
        setTotal(temp)
    }, [props.updCart])
    // setTotal(!updCart)
    
  return (
    <div style={{backgroundColor:"blue"}}>Total Items - {Total}</div>
  )
}

export default TotalItems

// I've added an interface for the Props to define the types of the cart and updCart props. 
// I've also updated the function declaration to use the arrow function syntax and specify the return type as a React.FC.