import { LogoutIcon, PlusSmIcon } from '@heroicons/react/solid';
import { Pagination } from '@mui/material';
import { format } from 'date-fns';
import ja from 'date-fns/locale/ja';
import { GetStaticProps } from 'next';
import type { NextPageWithLayout } from 'next';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { dehydrate, QueryClient } from 'react-query';
import { Layout } from '../../components/common/Layout';
import { Auth } from '../../firebase/firebase.config';
import { useContent } from '../../hooks/content/useContent';
import { allNews } from '../../hooks/query/useOrderNews';
import { UpdateNewsDTO } from '../../interface/types';
import { setEditTitle, setUpdateNewsReducer } from '../../redux/uiSlice';

const ContentPage: NextPageWithLayout = (props) => {
  const user = Auth.currentUser;
  const {
    data,
    page,
    pageDataMax,
    pageDataMin,
    pageNumber,
    handlePrivatePage,
    handlePageNation,
    handleLogout,
    handleMovePage,
    updateNewsButtonClick,
  } = useContent();
  // const { data, isLoading, error } = useGetOrderNewsQuery<GetOrderNewsQuery, Error>(
  //   graphqlRequestClient,
  //   {},
  //   { queryKey: 'news' },
  // );

  // if (error) {
  //   return <div>{error.message}</div>;
  // }

  // const { data, isLoading, error } = useGetOrderNewsQuery<GetOrderNewsQuery, Error>(
  //   graphqlRequestClient,
  //   {},
  // );


  return (
    <div className="m-auto w-1/2 font-hiragino">
      <h1 className="py-4 text-2xl text-gray-500">投稿一覧</h1>
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-9rem-2.5rem)]">
        {data?.map((lie, index) => {
          return (
            pageDataMin <= index &&
            index < pageDataMax && (
              <div
                className="flex justify-between px-4 bg-white rounded-md border-b shadow-sm cursor-pointer"
                key={lie?.orderNo}
              >
                <div className="mt-1 h-full">
                  <div className="flex items-center h-1/3 text-sm text-gray-400">
                    {lie?.photoURL.length > 0 && (
                      <Image
                        src={lie?.photoURL}
                        alt="ログイン画像"
                        width={24}
                        height={24}
                        className="bg-gray-200 bg-center rounded-full"
                      />
                    )}
                    <p className="pl-2">
                      {`
                      @${lie.name}が${format(new Date(lie.created_at), 'yyyy年MM月dd (EEE)', {
                        locale: ja,
                      })}に投稿
                      `}
                    </p>
                  </div>
                  <div className="flex items-center pl-8 h-2/3 text-lg font-bold">
                    <p
                      className=" hover:text-blue-500"
                      onClick={() => handlePrivatePage(lie?.orderNo)}
                    >
                      {lie.title}
                    </p>
                  </div>
                </div>
                <div className="">
                  <PencilSquare
                    type="button"
                    color="blue"
                    size={20}
                    className="h-1/2 cursor-pointer"
                    onClick={() => updateNewsButtonClick(lie.id, lie.content, lie.title)}
                  />
                  <TrashFill
                    type="button"
                    color="blue"
                    size={20}
                    className="h-1/2 cursor-pointer"
                  />
                </div>
              </div>
            )
          );
        })}
      </div>
      <div className="static">
        <button
          className="flex absolute right-56 bottom-24 justify-center items-center w-28 h-28 leading-7 bg-indigo-600 rounded-full"
          onClick={handleMovePage}
        >
          <PlusSmIcon className="w-20 h-20" />
        </button>
        <button
          className="flex absolute right-56 bottom-64 justify-center items-center w-28 h-28 leading-7 bg-indigo-600 rounded-full"
          onClick={handleLogout}
        >
          <LogoutIcon className="my-3 w-5 h-5 text-blue-500 cursor-pointer" />
        </button>
      </div>
      <div className="flex justify-center items-center h-20 ">
        <Pagination
          count={pageNumber}
          variant="outlined"
          color="primary"
          page={page}
          onChange={handlePageNation}
        />
      </div>
    </div>
  );
};
export default ContentPage;

ContentPage.getLayout = (page: ReactNode) => {
  return <Layout title="TweetApp">{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('news', allNews);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
