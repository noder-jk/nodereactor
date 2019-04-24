import {MainDashboard} from './main';

import {InitPostEditor} from './post/manage/init-editor';

import {GeneralSetting, PermalinkSetting, ReadingSetting} from './settings';
import {PluginDirectory} from './plugin/directory';

import {ThemeDirectory} from './appearance/theme/directory';
import {InstalledThemes} from './appearance/theme/installed';
import {InstalledPlugins} from './plugin/installed';
import {AdminWidget} from './appearance/widget';

import {SearchWidgetInput, SearchWidgetOutput} from './appearance/widget/widgets/search';

import {ArbitraryTextInput, ArbitraryTextOutput} from './appearance/widget/widgets/arbitrary-text';

import {CustomHtmlInput, CustomHtmlOutput} from './appearance/widget/widgets/custom-html';

import {RecentPostInput, RecentPostOutput} from './appearance/widget/widgets/recent-post';

import {MenuWidgetInput, MenuWidgetOutput} from './appearance/widget/widgets/menu-widget'

import {FeaturedImage, CustomTemplate, PostHierarchy, PostTaxonomy} from './post/meta-boxes';
 
import {MediaPage} from './media';

import {Users} from './users/all';
import {UserCreate} from './users/create';
import {EditUser} from './users/edit';
import {MyProfile} from './users/my-profile';

import {PostList} from './post/posts';

import {TaxonomyPage} from './post/taxonomy';

import {MenuPage} from './appearance/menu';

export  {    
            MainDashboard, 
            
            PostList,
            InitPostEditor,
            TaxonomyPage,

            MediaPage,
            
            GeneralSetting, 
            PermalinkSetting, 
            ReadingSetting,
             
            PluginDirectory, 
            ThemeDirectory, 
            InstalledThemes, 
            AdminWidget,
            InstalledPlugins,

            SearchWidgetInput,
            SearchWidgetOutput,

            ArbitraryTextInput,
            ArbitraryTextOutput,

            CustomHtmlInput,
            CustomHtmlOutput,

            RecentPostInput,
            RecentPostOutput,

            MenuWidgetInput,
            MenuWidgetOutput,

            FeaturedImage,
            CustomTemplate,
            PostHierarchy,
            PostTaxonomy,

            MenuPage,

            Users,
            UserCreate,
            EditUser,
            MyProfile
        }