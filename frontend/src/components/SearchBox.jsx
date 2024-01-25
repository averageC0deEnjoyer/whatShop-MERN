import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const SearchBox = () => {
  const { searchKeyword: urlSearch, categoryName } = useParams();
  // console.log(categoryName);
  const [searchKeyword, setSearchKeyword] = useState(urlSearch || '');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim() && categoryName) {
      navigate(`/category/${categoryName}/search/${searchKeyword}`);
      setSearchKeyword('');
    } else if (searchKeyword.trim()) {
      navigate(`/search/${searchKeyword}`);
      setSearchKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setSearchKeyword(e.target.value)}
        value={searchKeyword}
        placeholder="Search Products"
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Search{' '}
      </Button>
    </Form>
  );
};

export default SearchBox;
