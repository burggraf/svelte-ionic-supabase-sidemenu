

export default {
  "meta": {},
  "id": "_default",
  "module": () => import('../src/routes/_module.svelte'),
  "file": {
    "path": "src/routes/_module.svelte",
    "dir": "src/routes",
    "base": "_module.svelte",
    "ext": ".svelte",
    "name": "_module"
  },
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {},
      "id": "_default_TestAuth_svelte",
      "name": "TestAuth",
      "module": () => import('../src/routes/TestAuth.svelte'),
      "file": {
        "path": "src/routes/TestAuth.svelte",
        "dir": "src/routes",
        "base": "TestAuth.svelte",
        "ext": ".svelte",
        "name": "TestAuth"
      },
      "children": []
    },
    {
      "meta": {
        "dynamic": true
      },
      "id": "_default_____fallback__svelte",
      "name": "[...fallback]",
      "module": () => import('../src/routes/[...fallback].svelte'),
      "file": {
        "path": "src/routes/[...fallback].svelte",
        "dir": "src/routes",
        "base": "[...fallback].svelte",
        "ext": ".svelte",
        "name": "[...fallback]"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_folder",
      "name": "folder",
      "module": false,
      "file": {
        "path": "src/routes/folder",
        "dir": "src/routes",
        "base": "folder",
        "ext": "",
        "name": "folder"
      },
      "children": [
        {
          "meta": {
            "dynamic": true
          },
          "id": "_default_folder__folder__svelte",
          "name": "[folder]",
          "module": () => import('../src/routes/folder/[folder].svelte'),
          "file": {
            "path": "src/routes/folder/[folder].svelte",
            "dir": "src/routes/folder",
            "base": "[folder].svelte",
            "ext": ".svelte",
            "name": "[folder]"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_index_svelte",
      "name": "index",
      "module": () => import('../src/routes/index.svelte'),
      "file": {
        "path": "src/routes/index.svelte",
        "dir": "src/routes",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_redirect_svelte",
      "name": "redirect",
      "module": () => import('../src/routes/redirect.svelte'),
      "file": {
        "path": "src/routes/redirect.svelte",
        "dir": "src/routes",
        "base": "redirect.svelte",
        "ext": ".svelte",
        "name": "redirect"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_widget",
      "name": "widget",
      "module": false,
      "file": {
        "path": "src/routes/widget",
        "dir": "src/routes",
        "base": "widget",
        "ext": "",
        "name": "widget"
      },
      "children": [
        {
          "meta": {
            "dynamic": true
          },
          "id": "_default_widget__id__svelte",
          "name": "[id]",
          "module": () => import('../src/routes/widget/[id].svelte'),
          "file": {
            "path": "src/routes/widget/[id].svelte",
            "dir": "src/routes/widget",
            "base": "[id].svelte",
            "ext": ".svelte",
            "name": "[id]"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_widget2",
      "name": "widget2",
      "module": false,
      "file": {
        "path": "src/routes/widget2",
        "dir": "src/routes",
        "base": "widget2",
        "ext": "",
        "name": "widget2"
      },
      "children": [
        {
          "meta": {
            "dynamic": true
          },
          "id": "_default_widget2__id__svelte",
          "name": "[id]",
          "module": () => import('../src/routes/widget2/[id].svelte'),
          "file": {
            "path": "src/routes/widget2/[id].svelte",
            "dir": "src/routes/widget2",
            "base": "[id].svelte",
            "ext": ".svelte",
            "name": "[id]"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_widgets_svelte",
      "name": "widgets",
      "module": () => import('../src/routes/widgets.svelte'),
      "file": {
        "path": "src/routes/widgets.svelte",
        "dir": "src/routes",
        "base": "widgets.svelte",
        "ext": ".svelte",
        "name": "widgets"
      },
      "children": []
    }
  ]
}