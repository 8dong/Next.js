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

> Parallel Routes 내부에서도 Intercepting Routes 사용 가능. 주의할 점으로 intercepting 될 때 무시되는 경로들은 동일하게 무시되어 Interceipting 수행. 예를 들어, "/app/dashboard/@modal/(.)i/"의 경우 "/app/dashboard/i"를 intercepting. (.) 자체는 현재 디렉토리를 의미하지만 @modal 자체가 url에 영향을 주지 않으므로 intercepting되는 route 또한 @modal을 무시한 dashboard를 가리킴.

> 만약 페러렐 라우트 내 인터셉팅 라우트를 사용하는 경우 인터셉팅된 url 경로로 변경 되지만, 실제로 해당 경로의 Page 컴포넌트는 렌더링되지 않으며 기존 페러렐 라우트처럼 직전 페이지에 병렬로 표시됨.

> Intercepting Routes는 클라이언트 사이드에서 라우팅될 때만 Intecepting되며, 클라이언트상에서 라우팅되지 않은 경우 기존 페이지가 렌더링. 예를 들어, "app/dashboard/@modal/(.)i"가 intercepting되지 않는다면 "app/dashboard/i"가 라우팅.

#### Private Routes

디렉토리명을 "_forder"로 작성한 경우 여러 페이지에서 공통적으로 사용하는 컴포넌트들을 작성. private route의 경우 실제 라우팅되지 않으며, 단지 공통적으로 사용되는 컴포넌트들을 위해 사용. private route에 존재하는 컴포넌트들을 import하여 사용.

### File Conventions

#### layout.tsx

layout.tsx가 export default한 Layout 컴포넌트는 props로 page.tsx가 export default한 컴포넌트를 children prop으로 전달받음. 추가적으로 params prop도 전달받으며 이는 동적 라우팅에 대한 경로값을 객체 형태로 전달 받음.

layout.tsx는 app 디렉토리 내 각 하위 디렉토리 마다 하나씩 설정 가능. 만약 하위 디렉토리에 layout.tsx가 존재하는 경우 상위 layout.tsx가 하위 layout.tsx를 포함하는 형식으로 적용(nested layout).

예를 들어,"app/dashboard/dashboard/settings/layout.tsx"나 "app/dashboard/dashboard/analytics/layout.tsx"의 경우 "app/dashboard/layout.tsx"를 포함.

client side navigation을 사용하는 경우 layout 컴포넌트는 리렌더링 되지 않음. 만약 리렌더링이 필요한 Layout 컴포넌트가 필요한 경우 layout.tsx 대신 template.tsx 사용.

"app/layout.tsx"는 루트 레이아웃으로 동작하며 필수로 추가해주여야 함. "app/layout.tsx"의 Layout 컴포넌트는 `<html>` and `<body>` 태그 반드시 정의해주어 함.

```javascript
// app/layout.tsx

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