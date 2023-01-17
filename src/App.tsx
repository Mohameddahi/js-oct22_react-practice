import React from 'react';
import './App.scss';
import 'bulma/css/bulma.css';
import cn from 'classnames';

import usersFromServer from './api/users';
import { User } from './Types/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
// import { Category } from './Types/categories';
// import { Product } from './Types/products';

const getUser = (ownerId: number): User | null => {
  const foundUser = usersFromServer.find(user => user.id === ownerId);

  return foundUser || null;
};

// const getCategory = (categoryId: number): Category | null => {
//   const foundCategory = categoriesFromServer
//     .find(category => category.id === categoryId);

//   return foundCategory || null;
// };

const categoriesWithUsers = categoriesFromServer.map(category => {
  const user = getUser(category.ownerId);

  return {
    id: category.id,
    title: category.title,
    icon: category.icon,
    user,
  };
});

const productsWithCategoriesAndUsers = productsFromServer.map(product => {
  const category = categoriesWithUsers
    .find(category1 => category1.id === product.categoryId);

  return {
    id: product.id,
    name: product.name,
    user: category ? category.user : null,
    category: category || null,
  };
});
// export const products: Product[] = productsFromServer.map(product => ({
//   ...product,
//   category: getCategory(product.categoryId),
//   user: getUser(2),
// }));

export const App: React.FC = () => {
  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
              >
                User 1
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                className="is-active"
              >
                User 2
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
              >
                User 3
              </a>
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {productsWithCategoriesAndUsers.map(product => (
                <tr
                  key={product.id}
                >
                  <td>
                    {product.id}
                  </td>
                  <td>
                    {product.name}
                  </td>
                  <td>
                    {product.category?.icon}
                    {' - '}
                    {product.category?.title}
                  </td>

                  <td
                    className={cn({
                      'has-text-link': product.user?.sex === 'm',
                      'has-text-danger': product.user?.sex === 'f',
                    })}
                  >
                    {product.user?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
