import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DisCart from './DisCart';
import TotalItems from './TotalItems';

interface Product {
  id: number;
  desc: string;
  price: number;
}

interface CartItem extends Product {
  qty: number;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [desc, setDesc] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(true);
  const MY_SERVER = 'http://localhost:5000/products';
  const [updCart, setUpdateCart] = useState<boolean>(false);
  const getData = async () => {
    axios.get<Product[]>(MY_SERVER).then(res => setProducts(res.data));
    // console.table(products);
  };

  const delItem = (id: number) => {
    axios.delete(`${MY_SERVER}/${id}`);
    // setproducts(products.filter(item => item.id != id))
    setRefreshFlag(!refreshFlag);
  };

  const AddProduct = () => {
    axios.post(MY_SERVER, { desc, price });
    setRefreshFlag(!refreshFlag);
  };

  const updItem = async (prod: Product) => {
    let res = await axios.put(`${MY_SERVER}/${prod.id}`, { desc, price });
    setRefreshFlag(!refreshFlag);
  };

  useEffect(() => {
    getData();
  }, [refreshFlag]);

  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem('cart')!);
    // console.log(temp)
    if (temp) {
      if (temp.length > 0) {
        setCart(temp);
      }
    }
  }, []);

  //////////////////////////////////////////
  // //////////////////////////cart Start
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const add2Cart = async (prod: Product, qty: number) => {
    const temp = cart.filter(item => item.id === prod.id)[0];
    console.log(cart.filter(item => item.id === prod.id));
    if (temp) {
      console.log(`found - ${temp.qty}`); //already in cart 
      if (temp.qty + qty === 0) {
        console.log("del item");
        setCart(cart.filter(item => item.id !== prod.id));
      }
      else {
        temp.qty += qty;
        setCart([...cart]);
      }
    }
    else {
      console.log("not found"); //not in cart
      const newItemInMyCart: CartItem = { id: prod.id, desc: prod.desc, price: prod.price, qty: 1 };
      let res = await setCart([...cart, newItemInMyCart]);
      localStorage.setItem('cart', JSON.stringify([...cart, newItemInMyCart]));
      console.log([...cart, newItemInMyCart]);
    }
    setUpdateCart(!updCart);

    let tempTotal = 0; // here we add the top tatal to pay (with line 91 to show it)
    cart.forEach(element => {
      console.log(element.price);
      tempTotal += (element.price * element.qty);
    });
    setTotal(tempTotal);
  };
  // //////////////////////////cart END
  //////////////////////////////////////////

  return (
    <div className="App">
      <header className="App-header">
        <TotalItems cart={cart} updCart={updCart} />
        <h1>Total to pay: {total}</h1>
    Desc<input onChange={(e) => setDesc(e.target.value)} />
    Price<input onChange={(e) => setPrice(+e.target.value)} />
    Desc:{desc} &nbsp;
    price:{price}
    <button onClick={() => AddProduct()}>add</button>
    <hr />
    we have a total of {products.length} items
    {products.map((prod) => <div key={prod.id}> Desc: {prod.desc},  Price: {prod.price}
      <button onClick={() => delItem(prod.id)}>Del - {prod.id}</button>
      <button onClick={() => updItem(prod)}>Upd - {prod.id}</button>
      <button onClick={() => add2Cart(prod, 1)}>Buy- {prod.id}</button>
    </div>)}
    <hr />
    <DisCart myCart={cart} add2Cart={add2Cart} updCart={updCart} />
    <hr />
  </header>
</div>
);
}

export default App;



// I've added types to the `Product` and `CartItem` interfaces to make it clear what kind of data each variable represents. 
// I've also updated the state variable names to follow TypeScript naming conventions, 
// and added explicit types to the state variables to make it clear what kind of data they represent.

// I hope this helps! Let me know if you have any questions.

// json-server --watch db.json -p=5000

// {
//   "products": [
//     {
//       "id": 2,
//       "desc": "krembo",
//       "price": 2
//     },
//     {
//       "id": 3,
//       "desc": "jahnoon",
//       "price": 10
//     },
//     {
//       "id": 4,
//       "desc": "pizza",
//       "price": 9
//     },
//     {
//       "desc": "bisly",
//       "price": 8,
//       "id": 5
//     },
//     {
//       "desc": "bamba",
//       "price": 7,
//       "id": 6
//     }
//   ]
// }