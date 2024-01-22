import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((item) => (
          <LinkContainer
            key={item + 1}
            to={
              isAdmin
                ? `/admin/productlist/page/${item + 1}`
                : `/page/${item + 1}`
            }
          >
            <Pagination.Item active={item + 1 === page}>
              {item + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
