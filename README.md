# Next.js (v14.0.3)

## App Directory

v13에서는 app 디렉토리 구조에 따라 라우팅. app 디렉토리에서는 각 파일의 역할(기능)과 컨벤션이 지정되어 있음.

기본적으로 app 디렉토리 내 모든 컴포넌트들은 RSC(React Server Component)로 동작. 만약 RCC로 설정하기 위해서는 파일 최상단에 "use client";를 작성해야함.

```javascript
// "app/page.tsx"

'use client'; // RCC 컴포넌트 선언

import { NextPage } from 'next';

const Page: NextPage = () => {
  return <>Page Content,,,</>;
};
```

### Directory Conventions

#### Dynamic Routes

디렉토리명을 "[forder]"처럼 대괄호로 깜싼 경우 기존 pages 라우팅처럼 동적 라우팅으로 설정 가능.

> 동적 라우팅이란 URL 경로값으로 페이지 컴포넌트 내 렌더링될 정보를 동적으로 결정하여 페이지를 렌더링합니다. 이는 하나의 페이지를 재사용하여 여러 페이지로 동작하기 위해서 사용.

#### Route Groups

디렉토리명을 "(forder)"소괄호로 감싼 경우 실제 해당 경로는 무시.

예를 들어, app/(marketing)/about 경로에 생성된 페이지는 "/(marketing)/about"이 아닌 "(marketing)"이 무시된 "/about"으로 접근시에 라우팅.

즉, 소괄호로 디렉토리를 만들어 경로들의 그룹을 생성할 수 있으며, 하위에 layout.tsx나 template.tsx를 통해 경로에 영향을 주지 않고 경로별 layout을 설정 가능.

#### Parallel Routes

디렉토링명을 "@forder"로 작성한 경우 실제로 해당 경로 또한 무시. 이는 하나의 레이아웃에 여러 page를 표시해주는 병렬 라우팅 제공. 이때 @forder/page.tsx에서 export한 컴포넌트의 경우 @forder와 동일한 레벨에 있는 layout 컴포넌트 prop으로 전달되며, 이때 전달되는 prop 네이밍은 디렉토리 명으로 전달.

예를 들어, "/app/@modal/dashboard/page.tsx"가 export default한 컴포넌트는 "/app/dahboard/layout.tsx"가 export default한 컴포넌트에 modal prop으로 전달.

```javascript
// "app/dashbaord/layout.tsx"

import { NextPage } from 'next';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  modal: ReactNode; // "app/@modal/dashboard/page.tsx"에서 export default한 컴포넌트
}

const Layout: NextPage<IProps> = ({ children, modal }) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default Layout;
```

<hr />

페러렐 라우트 또한 중첩된 경로를 작성하여 하위 경로에 대해서 병렬 라우팅 가능.

예를 들어, "app/@modal/dashboard/[id]/page.tsx"가 export default한 컴포넌트는 "/app/dahsboard/[id]/layout.tsx"가 export default한 컴포넌트에 modal prop으로 전달.

```javascript
// "app/dashbaord/[id]/layout.tsx"

import { NextPage } from 'next';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  modal: ReactNode; // "app/@modal/dashboard/[id]/page.tsx"에서 export default한 컴포넌트
}

const Layout: NextPage<IProps> = ({ children, modal }) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default Layout;
```

이때 주의할 점으로 상위 페러렐 라우트를 사용하지 않는 경우에는 빈 콘텐츠를 갖는 page.tsx대신 default.tsx 라는 컨벤션을 갖는 파일을 추가해주어야 함. "app/@modal/dashboard/[id]/page.tsx"경로의 경우 "/dashboard"에서 페러렐 라우트를 사용하지 않는 경우 "app/@modal/dashboard/default.tsx"라는 파일을 추가해주어야 함.

```javascript
// "app/@modal/dashboard/default.tsx"

import { NextPage } from 'next';

const Default: NextPage = () => {
  return null;
};

export default Default;
```

#### Intercepting Routes

디렉토리명을 "(...)forder", "(..)forder" 혹은 "(.)forder"로 작성한 경우 상위 route를 intercepting하는 intercepting route로 동작. 즉, 소괄호 안 "."은 route depth를 의미, 여러 번 사용 가능하며 원하는 route를 intercepting 가능.
예를 들어, "/app/dashboard/(..)i/page.tsx"의 경우 "app/i/page.tsx"를 interceipting함, "app/dashboard/(..)(..)i"의 경우 "app/i"를 interceipting.

Parallel Routes 내 Intercepting Routes 사용 가능하며, 주의할 점으로 intercepting 될 때 무시되는 경로들은 동일하게 무시되어 Interceipting 수행. 
예를 들어, "/app/dashboard/@modal/(.)i/"의 경우 "/app/dashboard/i"를 intercepting. (.) 자체는 현재 디렉토리를 의미하지만 @modal 자체가 url에 영향을 주지 않으므로 intercepting되는 route 또한 @modal을 무시한 dashboard를 가리킴. 페러렐 라우트 뿐만 아니라 url 주소에 영향을 주지 않는 Route Groups, Private Routes 등도 동일하게 무시되어 Intercepting됨.

만약 모달을 Parallel Routes로 사용하는 경우 Intercepting Routes와 함께 사용하여 원하는 url 경로로 모달을 표시할 수 있음. 이로 인해 URL을 통해 모달 내용을 공유할 수 있게 되고, 페이지를 새로 고침할 때 모달을 닫지 않고 컨텍스트를 보존할 수도 있으며, 이전 경로로 이동하는 대신 뒤로 가기로 모달을 닫거나 앞으로 가기로 모달을 다시 열수 있음.

> 만약 페러렐 라우트 내 인터셉팅 라우트를 사용하는 경우 인터셉팅된 url 경로로 변경 되지만, 실제로 해당 경로의 Page 컴포넌트는 렌더링되지 않으며 기존 Page 컴포넌트만 리렌더링되고 Layout 컴포넌트에 페러렐 컴포넌트가 prop으로 전달.

> Intercepting Routes는 클라이언트 사이드에서 라우팅될 때만 Intecepting되며, 클라이언트상에서 라우팅되지 않은 경우 기존 페이지가 렌더링. 예를 들어, "app/dashboard/@modal/(.)i"가 intercepting되지 않는다면 "app/dashboard/i"가 라우팅.

#### Private Routes

디렉토리명을 "_forder"로 작성한 경우 여러 페이지에서 공통적으로 사용하는 컴포넌트들을 작성. private route의 경우 실제 라우팅되지 않으며, 단지 공통적으로 사용되는 컴포넌트들을 위해 사용. private route에 존재하는 컴포넌트들을 import하여 사용.

### File Conventions

#### layout.tsx

layout.tsx가 export default한 Layout 컴포넌트는 props로 page.tsx가 export default한 컴포넌트를 children prop으로 전달받음. 추가적으로 params prop도 전달받으며 이는 동적 라우팅에 대한 경로값을 객체 형태로 전달 받음.

layout.tsx는 app 디렉토리 내 각 하위 디렉토리 마다 하나씩 설정 가능. 만약 하위 디렉토리에 layout.tsx가 존재하는 경우 상위 layout.tsx가 하위 layout.tsx를 포함하는 형식으로 적용(nested layout).

예를 들어,"app/dashboard/settings/layout.tsx"나 "app/dashboard/analytics/layout.tsx"의 경우 "app/dashboard/layout.tsx"를 포함.

client side navigation을 사용하는 경우 layout 컴포넌트는 리렌더링 되지 않음. 만약 리렌더링이 필요한 Layout 컴포넌트가 필요한 경우 layout.tsx 대신 template.tsx 사용.

"app/layout.tsx"는 루트 레이아웃으로 동작하며 필수로 추가해주여야 함. "app/layout.tsx"의 Layout 컴포넌트는 `<html>` and `<body>` 태그 반드시 정의해주어 함.

```javascript
// "app/layout.tsx"

import { ReactNode } from 'react';

interface IProps {
  children: ReactNode; // "app/page.tsx"에서 export default한 컴포넌트
  params?: { [key: string]: string } // 동적 라우팅에 대한 경로 정보
}

const RootLayout: FC<IProps> = ({ children, params }) => {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
```

#### tempalte.tsx

tempalte.tsx는 layout.tsx와 동일한 역할을 하기 때문에 동일한 폴더 내 layout.tsx가 존재한다면 template.tsx를 사용할 수 없음(공존 불가능).

layout.tsx와의 차이점으로는 layout.tsx를 상위로서 공유하는 하위 경로로 라우팅하더라도 공유하는 Layout 컴포넌트는 리렌더링되지 않지만, template 컴포넌트를 사용하게 된다면 하위 경로로 변경될 때마다 template 컴포넌트가 새롭게 마운트된다는 점을 갖고 있음.

#### page.tsx

page.tsx는 페이지 콘텐츠를 나타내기 위한 Page 컴포넌트로 디렉토리마다 필수적으로 존재해야 하는 파일. 디렉토리 내 layout.tsx가 존재하는 경우 layout.tsx(or template.tsx)의 children prop으로 전달되는 컴포넌트.

페이지 컴포넌트는 props로 searchParams을 전달받음. searchParams는 쿼리 스트링 값을 객체 형태로 전달 받음. 추가적으로 params prop도 전달받으며 동적 라우팅하는 경우 경로에 대한 정보를 객체 형태로 전달받음.

```javaScript
// "app/page.tsx"

import { NextPage } from 'next';

interface IProps {
  searchParams?: { [key: string]: string } // 쿼리 스트링에 대한 정보
  params?: { [key: string]: string } // 동적 라우티에 대한 경로 정보
}

const Page: NextPage<IProps> = ({ searchParams, params }) => {
  return <main>Page Content,,,</main>;
}

export default Page;
```

#### default.tsx

디렉토리 내 page.tsx는 필수적으로 작성해주어야 하지만 만약 경로에 페이지 콘텐츠가 없는 경우 빈 콘텐츠를 나타내는 page.tsx 대신 default.tsx 추가 가능.

예를 들어, 페러렐 라우트에서 사용되지 않는 상위 경로의 경우 page.tsx의 콘텐츠가 존재하지 않기 때문에 page.tsx 대신 default.tsx를 작성. 이는 빈 콘텐츠를 갖는 page.tsx를 불필요하게 생성하지 않기 위해서 사용.

```javascript
import { NextPage } from 'next';

const Default: NextPage = () => {
  return null;
};

export default Default;
```

#### not-found.tsx

not-found라는 파일명으로 app 디렉토리 하위에 생성시 해당 컴포넌트는 일치하는 경로가 없는 경우 라우팅됨. 즉, 404 에러 페이지를 의미.

```javascript
// "app/not-found.tsx"

import { NextPage } from 'next';

const NotFound: NextPage = () => {
  return (
    <main>
      <h1>해당 페이지가 존재하지 않습니다.</h1>
      <button>돌아가기</button>
    </main>
  );
};

export default NotFound;
```

## Functions

### useRouter

url을 변경하기 위해서는 next/navigation이 제공하는 useRouter 훅 사용. useRouter 훅이 호출시 반환하는 객체에 push, replace, refresh, prefetch, back, forward 메서드 존재 (client side navigation).

```javascript
'use client';

import { NextPage } from 'next';
import { useRouter } from 'next/navigation';

const Page: NextPage = () => {
  const router = useRouter();

  // 1. router.push(href: string, { scroll: boolean })
  //    첫 번째 인수로 이동할 url 경로 전달.
  //    두 번째 인수로 옵션에 대한 객체를 전달. scroll 프로퍼티의 경우 이전 페이지에 대한 스크롤 위치 기억 여부에 대한 불리언 값 작성 (history stack에 push).

  // 2. router.replace(href: string, { scroll: boolean })
  //    첫 번째 인수로 이동한 url 경로 전달.
  //    두 번째 인수로 옵션에 대한 객체를 전달. scroll 프로퍼티의 경우 이전 페이지에 대한 스크롤 위치 기억 여부에 대한 불리언 값 작성 (현재 history stack replace).

  // 3. router.refresh()
  //    현재 url 경로로 refresh. refresh의 경우 data re-fetching, server component re-rendering 등을 수행.

  // 4. router.prefretch(href: string)
  //    첫 번째 인수로 작성한 경로에 대한 페이지를 pre-fetching. 이는 클라이언트 사이드에서 빠른 페이지 전환 제공.

  // 5. router.back()
  //    history stack에서 이전 stack에 대한 경로로 이동.

  // 6. router.forward()
  //    history stack에서 앞 stack에 대한 경로로 이동.

  return null;
}

export default Page;
```

### usePathname

usePathname 훅은 현재 url의 path 값을 문자열로 반환. 이때 쿼리 스트링은 제외한 경로에 대한 부분만을 문자열로 반환.

```javascript
// "app/blog/hello-world/page.tsx"

'use client';

import { NextPage } from 'next';

const Page: NextPage = () => {
  const pathname = usePathname(); 
  // URL -> "blog/hello-world?v=1"
  // pathname -> '/blog/hello-world'

  return null;
}

export default Page
```

### useSearchParams

useSearchParams 훅 호출시 반환하는 객체의 get 메서드를 호출할 때 인수로 쿼리 키 값 전달. toString 메서드 호출시 현재 쿼리 스트링 전체를 반환.

```javascript
'use client';

import { Nextpage } from 'next';
import { useSearchParams } from 'next/navigation';

const Page: NextPage = () => {
  const searchParams = useSearchParams()

  searchParams.get('my-project'); 
  // URL -> "/dashboard?search=my-project"
  // searchParams.get('my-project') -> 'my-project'

  searchParams.toString();
  // URL -> "/dashboard?search=my-project"
  // searchParams.toString() -> 'search=my-project'

  return null;
}

export default Page;
```

### useParams

useParams 훅 호출시 반환하는 객체는 동적 라우팅에 대한 정보를 객체 형태로 반환.

```javascript
// "/shop/[tag]/[item]/page.tsx"

'use client';

import { NextPage } from 'next';
import { useParams } from 'next/navigation';

const Page: NextPage = () => {
  const pararms = usePararms();
  // URL -> "/shop/shoes/nike-air-max-97"
  // pararms -> { tag: 'shoes', tag: 'nike-air-max-97' }

  return null;
}

export default Page;
```

### useSelectedLayoutSegment & useSelectedLayoutSegments

useSelectedLayoutSegment와 useSelectedLayoutSegments훅은 현재 활성 상태인 하위 세그먼트 값을 문자열 혹은 배열을 반환. 만약 활성된 세그먼트가 없는 경우 null 반환.

useSelectedLayoutSegment 훅의 경우 활성화된 가장 상위 세그먼트 스트링값을 반환. 만약 활성화된 모든 세그먼트를 반환받고 싶다면 useSelectedLayoutSegments 훅 사용.

```javascript
// "app/dashboard/layout.tsx"

'use client';

import { FC, ReactNode } from 'react';
import { useSelectedLayoutSegment, useSelectedLayoutSegments } from 'next/navigation';

interface IProps {
  children: ReactNode;
}

const Layout: FC<IProps> = ({ children }) => {
  const segment = useSelectedLayoutSegment() 
  // URL -> "/dashboard", segment -> null
  // URL -> "/dashboard/settings", segment -> 'settings'
  // URL -> "/dashboard/analytics", segment -> 'analytics'
  // URL -> "/dashboard/analytics/monthly", segment -> 'analytics'

  const segments0 = useSelectedLayoutSegments() 
  // URL -> "/dashboard", segments -> null
  // URL -> "/dashboard/settings", segments -> ['settings']
  // URL -> "/dashboard/analytics", segments -> ['analytics']
  // URL -> "/dashboard/analytics/monthly", segments -> ['analytics', 'monthly']

  return <main>{children}</main>
}

export default Layout;
```

## Environment Variables

Next에서 환경 변수를 사용하기 위해서는 프로젝트 루트 경로에 ".env" 확장자 파일을 생성하여 사용. Next는 자동으로 구동 환경에 대한 값을 process.env.NODE_ENV 환경 변수에 바인딩하고 있으며 개발 환경에서는 "development", 배포 환경에서는 "production", 테스트 환경에서는 "test" 값을 갖고 있음.

환경 변수 파일 내 "NEXT_PUBLIC_"이라는 prefix가 없는 경우 브라우저에서는 접근할 수 없고 서버에서만 접근할 수 있는 환경 변수가 되며, 있는 경우에는 서버와 브라우저 모두가 접근할 수 있는 환경 변수가 됨.

- ".env" 파일은 모든 구동 환경에서 공통적으로 적용할 디폴트 환경 변수를 정의. 가장 우선순위가 낮아 다른 환경 변수 파일 내 동일한 이름의 환경 변수가 있다면 오버라이딩됨.

- ".env.development" 파일은 개발 환경에서 사용되는 환경 변수 파일 (process.env.NODE_NEV === "development").

- ".env.production" 파일은 배포 환경에서 사용되는 환경 변수 파일 (process.env.NODE_NEV === "production").

- ".env.test" 파일은 테스트 환경에서 사용되는 환경 변수 파일 (process.env.NODE_NEV === "test").

- ".env.local" 파일은 가장 우선순위가 높은 환경 변수 파일이며 다른 환경 변수 파일에 작성된 동일한 이름의 환경 변수를 오버라딩함.

```javascript
// ".env"
// 가장 우선순위가 낮음. 모든 환경에서 공통으로 사용할 디폴트 키를 관리.
NEXT_PUBLIC_ANALYTICS_ID=default_analytics_id
NEXT_PUBLIC_API_KEY=default_api_key
NODE_VALUE=default_value  


// ".env.development"
// 개발 환경(process.env.NODE_ENV === "development")에서 사용할 키를 등록. 
// 개발 환경일 경우 ".env"에 같은 환경변수가 있다면 오버라이딩.
NEXT_PUBLIC_API_KEY=dev_api_key
NODE_VALUE=dev_value


// ".env.production"
// 배포 & 빌드환경(process.env.NODE_ENV === "production")에서 사용할 키를 등록. 
// 배포환경일 경우 ".env"에 같은 환경변수가 있다면 오버라이딩.
NEXT_PUBLIC_API_KEY=prod_api_key
NODE_VALUE=prod_value


// ".env.local"
// 모든 환경에서 최우선 순위로 적용할 환경 변수를 등록.
// 모든 ".env.*" 파일보다 우선 순위가 높음 (동일한 환경변수가 있다면 모두 오버라이딩)
NEXT_PUBLIC_API_KEY=local_api_key
NODE_VALUE=local_value
```

## Server Actions

Server Actions는 Form Mutation(생성, 업데이트, 삭제 등)을 서버 거치지 않고도 컴포넌트 내에서 비동기 함수를 직접 정의하여 조작 가능. 

서버 혹은 클라이언트 컴포넌트 내부에서 모두 사용가능하고 함수 내부 최상단 혹은 파일 최상단에 "use server"라는 지시어를 작성해야하며, 직렬화 가능한 값만 반환 가능. 또한 async 함수로 정의.
Server Actions는 인수로는 FormData 타입의 값을 전달받기 때문에 useState나 useRef 훅으로 input의 value를 가져오지 않고 formData.get 메서드로 접근 가능.

만약 formData 외 추가적인 인수를 전달하고자 한다면 아래처럼 Function.prototype.bind 메서드를 사용하여 전달.

```javascript
// app/_actions/user.ts

'use server';

// updateUser.bind(null, userId);
export const updateUser = async (userId: string, formData: FormData) => {
  // ,,,
}
```

### server components

서버 컴포넌트에서는 컴포넌트 내부에 Server Actions 함수를 작성하고, form 태그의 action 어트리뷰트에 Server Actions 참조를 작성.

```javascript
// "app/page.tsx"

import { NextPage } from 'next';

const Page: NextPage = () => {
  // Server Actions
  const createInvoice = async (formData: FormData) => {
    'use server';

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status')
    };

    // mutate data,,,
    // revalidate cache,,,
  };

  return <form action={createInvoice}>{/* ,,, */}</form>;
};

export default Page;
```

### client components

server action을 클라이언트 컴포넌트에서 사용 가능하며, form 상태 또한 클라이언트상에 표시할 수 있음. 
이때 "use server" 지시어는 서버 컴포넌트에서만 작성 가능하기 때문에 server action은 분리된 파일에 작성하고 이를 import하여 사용해야 함.

```javascript
// "app/_actions/index.ts"

'use server';

export const createInvoice = async (prevState: { message: string }, formData: FormData) => {
  const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status')
    };

    // mutate data,,,
    // revalidate cache,,,
}
```

```javascript
// "app/_components/SignupForm.tsx"

'use client';

import { FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { createInvoice } from '@/_actions';

const SignUpForm: FC = () => {
  // const [state, formAction] = useFormState(fn, initialState, permalink?);
  const [state, formAction] = useFormState(createInvoice, { message: '' });

  return <form action={formAction}>{/* ,,, */}</form>;
};

export default Page;
```

react-dom이 제공하는 useFormState, useFormStatus 훅을 위와 같이 이용하여 server action을 사용할 수 있음. 
이때 server action은 서버 코드로 클라이언트에는 접근할 수 없음.

> useFormState 훅은 react-dom이 제공하는 훅으로, 첫 번째 인수로 action 함수, 두 번째 인수로 초기 상태값을 전달하면 반환값으로 배열을 반환하고, 배열의 첫 번째 요소는 form 상태값, 두 번째 요소는 formAction 함수를 반환. 이때 반환값인 formAction 함수를 form 태그의 action 어트리뷰트에 작성.