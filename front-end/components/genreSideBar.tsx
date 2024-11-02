import React from 'react';
import styles from "../styles/GenreSideBar.module.css";
import { GenreProps } from '@/types';



const GenreSideBar: React.FC<GenreProps> = ({ genres, selectedGenre, onGenreChange }) => {
    return ( 
    <aside className={styles.sidebar}>
        <h3>Genres</h3>
    {genres.map((genre: string, index: number) => (
        <label key={index} className={styles.checkbox}>
            <input
                type="checkbox"
                checked={selectedGenre === genre}
                onChange={() => onGenreChange(genre)}
            />
            {genre}
        </label>
    ))}
</aside>
);
};
export default GenreSideBar;

