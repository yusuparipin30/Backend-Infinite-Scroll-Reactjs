//1.import react   || 7.import useState & useEffect
import React,{useState, useEffect} from 'react';
//8. import axios untuk berinteraksi dengan API 
import axios from "axios";
//18. import react infinite untuk menjalankan infinite scroll component
import InfiniteScroll from "react-infinite-scroll-component";

//2.
const UserList = () =>  {
    //9. membuat state baru dengan initial value emty array
    const [users, setUsers] = useState([]);
    const [lastId, setLastId] = useState(0);
    /*13.simpan lastId di dalam state dengan cara temporary ,mengapa menyimpannya 
    dgn state baru karna kalau langsung di state  lastId tatemya akan terdapat perubahan*/
    const [tempId, setTempId] = useState(0);
    const [limit, setLimit] = useState(20);
    const [keyword, setKeyword] = useState("");
    //23.menjalankan function search, state ini berfungsi menghandle input dari pencarian
    const [query, setQuery] = useState("");

    //20. masukan kedalan state
    const [hasMore, setHasMore] = useState(true);
 

    //15.memamnggil getUsers kedalam useEffect hook
    useEffect (()=>{
        getUsers();
        //16.jika ada perubahan pada lastId dan keyword nya makan akan panggil lagi method getUsers
    },[lastId, keyword]);

    //10.membuat method yang berfungsi untuk mengambil API dari backend
    const getUsers = async () => {
        const response = await axios.get(
            `http://localhost:5000/users?search_query=${keyword}&lastId=${lastId}&limit=${limit}`
            );
            /* 11.membuat variabel untuk menggabungkan antara users yang di dapat dari fcing
             response kemudian gabungkan dengan users yang sudah ada pada state*/
             const newUsers = response.data.result;
             //12.masukan kedalan state users lama dan yang baru yaitu newUsers
             setUsers([...users,...newUsers]);
             //14.set lastId di tempId pada state di atas
             setTempId(response.data.lastId);
             //21.set hasMOre pada responnya  
             setHasMore(response.data.hasMore);
    };

    //22.membuat method function fetchMore  dengan merubah lastId dan tempId , masukan nilai dari temId Ke lastId
    const fetchMore = () => {
        setLastId(tempId);
    };

    //26.buat function method searchData untuk memanggil onChange yang berada pada form
    //setKeyword value nya ambil dr query tp sebelunya reset lastId menjadi (0),dan kembalikan nilainya jd emty array[]
    const searchData = (e) =>{
        e.preventDefault();
        setLastId(0);
        setUsers([]);
        setKeyword(query);
    };

    return (
        //3. membuat kerangka form search dan table
        <div className="container mt-5">
            <div className="columns">
                <div className="column is-centered">
                    {/*4. membuat form search*/}
                    {/*25.membuat method onSubmit dan kasih method searchData*/}
                    <form onSubmit={searchData}>
                        <div className="field has-addons">
                            {/*5. membuat input form search*/}
                             {/*24.search tambahkan value={query} yg mengabil dari state query*/}
                            <div className="control is-expanded">
                                <input type="text"
                                className="input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Find Something Here..."
                                />
                            </div>
                            <div className="control">
                                <button type="submit" className="button is-info">Search</button>
                            </div>
                        </div>
                    </form>
                    {/*19.membuat infinite scroll di atas table dan tambahkan beberapa opsi*/}
                    {/*pada opsi next buat function fetchMore*/}
                    <InfiniteScroll
                    dataLength={users.length}
                    next={fetchMore}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    >
                    {/*6. membuat tabel */}
                    <table className="table is-striped is-bordered is-fullwidth mt-2">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Gender</th>
                                <th>Marital_sts</th>
                                <th>Category_people</th>
                                <th>Active_state</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*17.looping users pada state untuk mengambil datanya yang dari backend/server database*/}
                            {users.map((user, index)=>(
                                 <tr key={index}>
                                 <td>{index+1}</td>
                                 <td>{user.id}</td>
                                 <td>{user.name}</td>
                                 <td>{user.address}</td>
                                 <td>{user.gender}</td>
                                 <td>{user.marital_sts}</td>
                                 <td>{user.category_peole}</td>
                                 <td>{user.active_state}</td>
                             </tr>
                            ))}
                           
                        </tbody>
                    </table>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
}

export default UserList