import { Trans } from "@lingui-solid/solid/macro";

import MdBugReport from "@material-design-icons/svg/outlined/bug_report.svg?component-solid";
import MdFormatListNumbered from "@material-design-icons/svg/outlined/format_list_numbered.svg?component-solid";
import MdStar from "@material-design-icons/svg/outlined/star_outline.svg?component-solid";

import { CategoryButton, Column, iconSize } from "@revolt/ui";

export function Feedback() {
  return (
    <Column gap="lg">
      <CategoryButton.Group>
        <CategoryButton
          icon={<MdStar {...iconSize(22)} />}
          description={
            <Trans>Suggest new Limyrx Chat features on GitHub discussions.</Trans>
          }
          disabled
        >
          <Trans>Submit feature suggestion</Trans>
        </CategoryButton>
        <CategoryButton
          icon={<MdFormatListNumbered {...iconSize(22)} />}
          description={<Trans>Submit feedback</Trans>}
          disabled
        >
          <Trans>Feedback</Trans>
        </CategoryButton>
        <CategoryButton
          icon={<MdBugReport {...iconSize(22)} />}
          description={<Trans>View currently active bug reports here.</Trans>}
          disabled
        >
          <Trans>Bug Tracker</Trans>
        </CategoryButton>
      </CategoryButton.Group>
    </Column>
  );
}


