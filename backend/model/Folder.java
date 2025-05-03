package com.example.notepadx.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "folders")
@Getter
@Setter
public class Folder {
    @Id
    private String id;
    private String name;
    private String parentId;
}