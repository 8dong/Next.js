# Next.js (v14.0.3)

## App Directory

v13에서는 app 디렉토리 구조에 따라 라우팅. app 디렉토리에서는 각 파일의 역할(기능)과 컨벤션이 지정되어 있음.

기본적으로 app 디렉토리 내 모든 컴포넌트들은 RSC(React Server Component)로 동작. 만약 RCC로 설정하기 위해서는 파일 최상단에 "use client";를 작성해야함.

```javascript
// app/page.tsx

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
// app/dashbaord/layout.tsx

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
// app/dashbaord/[id]/layout.tsx

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
// app/@modal/dashboard/default.tsx

import { NextPage } from 'next';

const Default: NextPage = () => {
  return null;
};

export default Default;
```

#### Intercepting Routes

디렉토리명을 "(...)forder", "(..)forder" 혹은 "(.)forder"로 작성한 경우 상위 route를 intercepting하는 intercepting route로 동작. 즉, 소괄호 안 "."은 route depth를 의미, 여러 번 사용 가능하며 원하는 route를 intercepting 가능.

예를 들어, "/app/dashboard/(..)i/page.tsx"의 경우 "app/i/page.tsx"를 interceipting함, "app/dashboard/(..)(..)i"의 경우 "app/i"를 interceipting.

> Parallel Routes 내부에서도 Intercepting Routes 사용 가능. 주의할 점으로 intercepting 될 때 무시되는 경로들은 동일하게 무시되어 Interceipting 수행. 예를 들어, "/app/dashboard/@modal/(.)i/"의 경우 "/app/dashboard/i"를 intercepting. (.) 자체는 현재 디렉토리를 의미하지만 @modal 자체가 url에 영향을 주지 않으므로 intercepting되는 route 또한 @modal을 무시한 dashboard를 가리킴. 이는 페러렐 라우트뿐만 아니라 url에 영향을 주지 않는 모든 경로에 해당.

> Intercepting Routes는 클라이언트 사이드에서 라우팅될 때만 Intecepting되며, 클라이언트상에서 라우팅되지 않은 경우 기존 페이지가 렌더링. 예를 들어, "app/dashboard/@modal/(.)i"가 intercepting되지 않는다면 "app/dashboard/i"가 라우팅.

#### Private Routes

디렉토리명을 "_forder"로 작성한 경우 여러 페이지에서 공통적으로 사용하는 컴포넌트들을 작성. private route의 경우 실제 라우팅되지 않으며, 단지 공통적으로 사용되는 컴포넌트들을 위해 사용. private route에 존재하는 컴포넌트들을 import하여 사용.
