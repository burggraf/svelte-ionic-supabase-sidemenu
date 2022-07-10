<script lang="ts">
  import { goto } from "@roxi/routify";

  $goto("/folder/[folder]", { folder: "Inbox" });
</script>
