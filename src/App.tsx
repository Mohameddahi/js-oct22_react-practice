import React, { useState } from 'react';
import './App.scss';
import 'bulma/css/bulma.css';
import cn from 'classnames';

import usersFromServer from './api/users';
import { User } from './Types/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Category } from './Types/categories';
import { Product } from './Types/products';

const getUser = (ownerId: number): User | null => {
  const foundUser = usersFromServer.find(user => user.id === ownerId);

  return foundUser || null;
};

const getCategory = (categoryId: number): Category | null => {
  const foundCategory = categoriesFromServer
    .find(category => category.id === categoryId);

  return foundCategory || null;
};

export const products: Product[] = productsFromServer.map(product => {
  const category = getCategory(product.categoryId);
  const user = getUser(category?.ownerId || 0);

  return { ...product, category, user };
});

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedcategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const isCategorySelected = (categoryId: number) => {
    return selectedcategoryIds.includes(categoryId);
  };

  const toggleSelectedCategory = (categoryId: number) => {
    if (isCategorySelected(categoryId)) {
      setSelectedCategoryIds(current => current.filter(
        id => id !== categoryId,
      ));
    } else {
      setSelectedCategoryIds(current => [...current, categoryId]);
    }
  };

  let visibleProducts = [...products];

  if (selectedUserId) {
    visibleProducts = visibleProducts.filter(
      product => product.user?.id === selectedUserId,
    );
  }

  if (query) {
    const lowerQuery = query.toLowerCase();

    visibleProducts = visibleProducts.filter(
      product => product.name.toLowerCase().includes(lowerQuery),
    );
  }

  if (selectedcategoryIds.length > 0) {
    visibleProducts = visibleProducts.filter(
      product => selectedcategoryIds.includes(product.categoryId),
    );
  }

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
                className={cn({
                  'is-active': selectedUserId === 0,
                })}
                onClick={() => {
                  setSelectedUserId(0);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({
                    'is-active': selectedUserId === user.id,
                  })}
                  onClick={() => {
                    setSelectedUserId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  { query
                    && (
                      <>
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <button
                          data-cy="ClearButton"
                          type="button"
                          className="delete"
                          onClick={() => {
                            setQuery('');
                          }}
                        />
                      </>
                    )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedcategoryIds.length !== 0,
                })}
                onClick={() => {
                  setSelectedCategoryIds([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': isCategorySelected(category.id),
                  })}
                  onClick={() => {
                    toggleSelectedCategory(category.id);
                  }}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedCategoryIds([]);
                  setSelectedUserId(0);
                }}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
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
                {visibleProducts.map(product => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category?.icon} - ${product.category?.title}`}
                    </td>
                    <td
                      data-cy="ProductUser"
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
          )}
        </div>
      </div>
    </div>
  );
};
