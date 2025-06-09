"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Mahasiswa } from "@prisma/client";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { deleteMahasiswa } from "@/lib/actions/mahasiswa";
import { toast } from "sonner";

