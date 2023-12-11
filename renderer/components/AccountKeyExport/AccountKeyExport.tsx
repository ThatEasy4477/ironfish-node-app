import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  HStack,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import type { AccountFormat } from "@ironfish/sdk";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { trpcReact } from "@/providers/TRPCProvider";
import { PillButton } from "@/ui/PillButton/PillButton";
import { downloadString } from "@/utils/downloadString";

type FormatTypes = `${AccountFormat}`;

const formatOptions: FormatTypes[] = [
  "Mnemonic",
  "JSON",
  "Bech32",
  "SpendingKey",
];

export function AccountKeyExport({ accountName }: { accountName: string }) {
  const [exportFormat, setExportFormat] = useState<FormatTypes>("Mnemonic");

  if (accountName.length === 0) {
    throw new Error("Expected accountName to be a non-empty string");
  }

  const { data: exportData } = trpcReact.exportAccount.useQuery({
    name: accountName,
    format: exportFormat,
  });

  if (!exportData) return null;

  if (typeof exportData.account !== "string") {
    throw new Error("Expected exportData.account to be a string");
  }

  const accountData = exportData.account;

  return (
    <HStack gap={4}>
      <PillButton
        type="submit"
        height="60px"
        px={8}
        onClick={() => {
          downloadString(
            accountData,
            `iron-fish-account-${exportFormat.toLowerCase()}-${accountName}.txt`,
          );
        }}
      >
        <FormattedMessage defaultMessage="Export Account" />
      </PillButton>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          <HStack>
            <Text fontWeight="light">
              <FormattedMessage defaultMessage="Export Format:" />
            </Text>
            <Text>{exportFormat}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          {formatOptions.map((format) => (
            <MenuItem key={format} onClick={() => setExportFormat(format)}>
              {format}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </HStack>
  );
}