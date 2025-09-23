import  React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import CardMoviesComponents from '../../Components/CardMovies';
import PaginationComponent from '../../Components/Pagination';
import SearchBarCardComponents from '../../Components/SearchBox';
import searchMoviesFallback from '../../data/searchMoviesFallback.json';
import searchTVSeriesFallback from '../../data/searchTVSeriesFallback.json';

const  SearchContainer = ()=>{
    const [content, setContent] = useState([]);
    const [pageno, setPageno] = useState(1);
    const [paginationno, setPaginationno] = useState(0);

    const [searchValue, setSearchValue] = useState('dhoom');
    const [typeValue, setTypeValue] = useState('movie');
    const API_KEY = process.env.REACT_APP_NOT_SECRET_CODE;

    
    
    const GetDataTrending = async ()=>{
    try{
       const {data} = await axios.get(`https://api.themoviedb.org/3/search/${typeValue}?api_key=${API_KEY}&page=${pageno}&language=en-US&query=${searchValue}&include_adult=false`);
       setContent(data.results);
       setPaginationno(data.total_pages);
  } catch (error) {
    console.error("TMDB Search API failed, using fallback data:", error.message);
    if (typeValue === "movie") {
      const filtered = searchMoviesFallback.results.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setContent(filtered);
      setPaginationno(1);
    } else {
       const filteredTv = searchTVSeriesFallback.results.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setContent(filteredTv);
      setPaginationno(1);
    }
  }
    }

    useEffect(()=>{
        GetDataTrending();
        //eslint-disable-next-line
    }, [])

    const fetchDataQuery = ()=>{
        // 
        GetDataTrending()
    }
    
    const handleClick = (number)=>{
        setPageno(number);
    }
    
    useEffect(()=>{
        GetDataTrending();
        //eslint-disable-next-line
    }, [pageno])
    return (
        <main className='homePage'>
            <Container>
                <Row>
                    <Col className='col-12'>
                        <section>
                            <h1 className='txtCenter'>Search Movies /  TV Series</h1>
                           
                            <SearchBarCardComponents 
                                searchValue={searchValue}
                                setSearchValue={(value)=>{setSearchValue(value)}}
                                typeValue={typeValue}
                                setTypeValue={(value)=>{setTypeValue(value)}}
                                filterData={fetchDataQuery} />
                        </section>
                    </Col>
                </Row>
                <Row>
                    
                    <Col className='col-12'>
                        <Row>
                                {
                                    content && content.length > 0 ? content.map((item, index)=>{
                                        return (<CardMoviesComponents key={index} data={item} mediaType={typeValue}/>)
                                    }) : 'Not found'
                                }

                            {
                                paginationno && paginationno > 1 ? <PaginationComponent maxnum={paginationno} activenum={pageno} handleClick={handleClick}/> : ''
                            }
                        </Row>
                    </Col>
                    
                </Row>
            </Container>
        </main>
    )
}

export default SearchContainer;