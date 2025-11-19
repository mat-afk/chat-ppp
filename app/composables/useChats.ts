import { isToday, isYesterday, subMonths } from "date-fns";

interface Chat {
  id: string;
  label: string;
  icon: string;
  isNew: boolean;
  createdAt: string;
}

export function useChats(chats: Ref<Chat[] | undefined>) {
  const groups = computed(() => {
    const today: Chat[] = [];
    const yesterday: Chat[] = [];
    const lastWeek: Chat[] = [];
    const lastMonth: Chat[] = [];
    const older: Record<string, Chat[]> = {};

    const oneWeekAgo = subMonths(new Date(), 0.25);
    const oneMonthAgo = subMonths(new Date(), 1);

    chats.value?.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);

      if (isToday(chatDate)) {
        today.push(chat);
      } else if (isYesterday(chatDate)) {
        yesterday.push(chat);
      } else if (chatDate >= oneWeekAgo) {
        lastWeek.push(chat);
      } else if (chatDate >= oneMonthAgo) {
        lastMonth.push(chat);
      } else {
        const monthYear = chatDate.toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        });

        if (!older[monthYear]) {
          older[monthYear] = [];
        }

        older[monthYear].push(chat);
      }
    });

    const sortedMonthYears = Object.keys(older).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });

    const formattedGroups = [] as Array<{
      id: string;
      label: string;
      items: Array<Chat>;
    }>;

    if (today.length) {
      formattedGroups.push({
        id: "today",
        label: "Hoje",
        items: today,
      });
    }

    if (yesterday.length) {
      formattedGroups.push({
        id: "yesterday",
        label: "Ontem",
        items: yesterday,
      });
    }

    if (lastWeek.length) {
      formattedGroups.push({
        id: "last-week",
        label: "Última semana",
        items: lastWeek,
      });
    }

    if (lastMonth.length) {
      formattedGroups.push({
        id: "last-month",
        label: "Último mês",
        items: lastMonth,
      });
    }

    sortedMonthYears.forEach((monthYear) => {
      if (older[monthYear]?.length) {
        formattedGroups.push({
          id: monthYear,
          label: monthYear,
          items: older[monthYear],
        });
      }
    });

    return formattedGroups;
  });

  return {
    groups,
  };
}
