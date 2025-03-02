/* eslint-disable tailwindcss/no-custom-classname */
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, VFC } from 'react';
import { List } from 'react-bootstrap-icons';
import { HeaderDTO } from '../../interface/types';
import { useLogout } from '../../pages/content/useLogout';
import { Auth } from '../../util/firebase/firebase.config';

export const Header: VFC<HeaderDTO> = ({
  title,
  darkMode,
  setDarkMode,
  listFlag,
  setListFlag,
  listClickRef,
}) => {
  const user = Auth.currentUser;
  const { logout } = useLogout();
  const handleChangeDarkMode = useCallback(() => {
    if (darkMode) {
      localStorage.theme = 'light';
      setDarkMode(!darkMode);
    } else {
      localStorage.theme = 'dark';
      setDarkMode(!darkMode);
    }
  }, [darkMode, setDarkMode]);

  const listClick = useCallback(() => {
    setListFlag((listFlag) => !listFlag);
  }, [listFlag]);

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkMode(true);
      document.querySelector('html')?.classList.add('dark');
    } else {
      setDarkMode(false);
      document.querySelector('html')?.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header
        className={`fixed z-10 flex justify-between items-center px-3 w-full h-14 bg-white dark:bg-darkCard ${
          listFlag &&
          'maxLg:pointer-events-none maxLg:transition maxLg:ease-in maxLg:dark:opacity-80 maxLg:cursor-default'
        }
        `}
      >
        <div className="flex items-center">
          <button
            id="list"
            name="list"
            onClick={listClick}
            className={`${
              listFlag && 'maxLg:hidden'
            } hover:bg-gray-100 dark:hover:bg-darkBody hover:rounded-full dark:hover:opacity-50`}
            ref={listClickRef}
          >
            <List className="p-2 w-10 h-10" />
          </button>
          <span className="pt-1 pl-2 text-indigo-600 dark:text-gray-200 text-shadow">TweetApp</span>
        </div>
        <div className="flex items-center">
          <div className="inline-block relative mr-2 w-10 align-middle transition duration-200 ease-in select-none">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              checked={darkMode}
              className="toggle-checkbox"
              onChange={handleChangeDarkMode}
            />
            <label htmlFor="toggle" className="toggle-label"></label>
          </div>
          {user?.photoURL.length > 0 && (
            <button onClick={logout} className="mr-3">
              <div>
                <Image
                  src={user?.photoURL}
                  alt="ログイン画像"
                  width={32}
                  height={32}
                  className=" bg-center rounded-full"
                />
              </div>
            </button>
          )}
        </div>
      </header>
    </>
  );
};
