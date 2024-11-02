import React from 'react';
import styles from "../styles/Searchbar.module.css";
import { SearchBarProps } from '@/types';


const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch, resultsCount }) => (
    <div className={styles.searchWrapper}>
        <p>{resultsCount} results found</p>
        <input
            type="text"
            placeholder="Search by name or author"
            value={searchTerm}
            onChange={onSearch}
            className={styles.search}
        />
    </div>
);

export default SearchBar;
