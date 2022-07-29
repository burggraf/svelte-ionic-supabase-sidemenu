
/**
 * @roxi/routify 2.18.8
 * File generated Fri Jul 29 2022 07:01:41 GMT-0700 (Pacific Daylight Time)
 */

export const __version = "2.18.8"
export const __timestamp = "2022-07-29T14:01:41.825Z"

//buildRoutes
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports


//options
export const options = {}

//tree
export const _tree = {
  "name": "_module",
  "filepath": "/_module.svelte",
  "root": true,
  "ownMeta": {},
  "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/_module.svelte",
  "children": [
    {
      "isFile": true,
      "isDir": false,
      "file": "[...fallback].svelte",
      "filepath": "/[...fallback].svelte",
      "name": "[...fallback]",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/[...fallback].svelte",
      "importPath": "../src/routes/[...fallback].svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/:...fallback",
      "id": "_____fallback",
      "component": () => import('../src/routes/[...fallback].svelte').then(m => m.default)
    },
    {
      "isFile": false,
      "isDir": true,
      "file": "folder",
      "filepath": "/folder",
      "name": "folder",
      "ext": "",
      "badExt": false,
      "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/folder",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "[folder].svelte",
          "filepath": "/folder/[folder].svelte",
          "name": "[folder]",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/folder/[folder].svelte",
          "importPath": "../src/routes/folder/[folder].svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/folder/:folder",
          "id": "_folder__folder",
          "component": () => import('../src/routes/folder/[folder].svelte').then(m => m.default)
        }
      ],
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": false,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/folder"
    },
    {
      "isFile": true,
      "isDir": false,
      "file": "index.svelte",
      "filepath": "/index.svelte",
      "name": "index",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/index.svelte",
      "importPath": "../src/routes/index.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": true,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/index",
      "id": "_index",
      "component": () => import('../src/routes/index.svelte').then(m => m.default)
    },
    {
      "isFile": true,
      "isDir": false,
      "file": "redirect.svelte",
      "filepath": "/redirect.svelte",
      "name": "redirect",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/redirect.svelte",
      "importPath": "../src/routes/redirect.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/redirect",
      "id": "_redirect",
      "component": () => import('../src/routes/redirect.svelte').then(m => m.default)
    },
    {
      "isFile": true,
      "isDir": false,
      "file": "TestAuth.svelte",
      "filepath": "/TestAuth.svelte",
      "name": "TestAuth",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/TestAuth.svelte",
      "importPath": "../src/routes/TestAuth.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/TestAuth",
      "id": "_TestAuth",
      "component": () => import('../src/routes/TestAuth.svelte').then(m => m.default)
    },
    {
      "isFile": true,
      "isDir": false,
      "file": "TestData.svelte",
      "filepath": "/TestData.svelte",
      "name": "TestData",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/TestData.svelte",
      "importPath": "../src/routes/TestData.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/TestData",
      "id": "_TestData",
      "component": () => import('../src/routes/TestData.svelte').then(m => m.default)
    },
    {
      "isFile": false,
      "isDir": true,
      "file": "widget",
      "filepath": "/widget",
      "name": "widget",
      "ext": "",
      "badExt": false,
      "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/widget",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "[id].svelte",
          "filepath": "/widget/[id].svelte",
          "name": "[id]",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/markb/dev/svelte-ionic-supabase-sidemenu/src/routes/widget/[id].svelte",
          "importPath": "../src/routes/widget/[id].svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/widget/:id",
          "id": "_widget__id",
          "component": () => import('../src/routes/widget/[id].svelte').then(m => m.default)
        }
      ],
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": false,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/widget"
    }
  ],
  "isLayout": true,
  "isReset": false,
  "isIndex": false,
  "isFallback": false,
  "isPage": false,
  "isFile": true,
  "file": "_module.svelte",
  "ext": "svelte",
  "badExt": false,
  "importPath": "../src/routes/_module.svelte",
  "meta": {
    "recursive": true,
    "preload": false,
    "prerender": true
  },
  "path": "/",
  "id": "__module",
  "component": () => import('../src/routes/_module.svelte').then(m => m.default)
}


export const {tree, routes} = buildClientTree(_tree)

