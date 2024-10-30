package org.example;

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class Document {

    @Property()
    private final String documentID;

    @Property()
    private final String creatorID;

    @Property()
    private String documentName;

    @Property()
    private String documentHash;

    @Property()
    private final String documentType;

    @Property()
    private boolean  signable;

    public String getDocumentID(){
        return documentID;
    }

    public String getCreatorID() {
        return creatorID;
    }

    public String getDocumentName() {
        return documentName;
    }

    public String getDocumentHash() {
        return documentHash;
    }

    public String getDocumentType(){
        return documentType;
    }

    public boolean getSignable(){
        return signable;
    }

    public void setSignable(boolean signable){
        this.signable = signable;
    }

    public void setHash(String hash){
        this.documentHash = hash;
    }
    
    public void setName(String newName){
        this.documentName = newName;
    }


    /*
    Constructor
    document id is the name and this should be checked for uniqueness before document creation
    */
    public Document(@JsonProperty("documentID") final String documentID, @JsonProperty("creatorID") final String creatorID, 
                    @JsonProperty("documentName") final String documentName,@JsonProperty("documentHash") final String documentHash,
                    @JsonProperty("docType") final String documentType,@JsonProperty("signable") final boolean signable){
        
        this.documentID = documentID;
        this.creatorID = creatorID;
        this.documentName = documentName;
        this.documentHash = documentHash;
        this.documentType = documentType;
        this.signable = signable;
        
    }

    @Override
    public boolean equals(final Object obj) {
        if(this == obj){
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Document other = (Document) obj;

        return Objects.deepEquals(
            new String[]{getDocumentID(), getCreatorID(), getDocumentName(), getDocumentHash(), getDocumentType(),String.valueOf(getSignable())},
            new String[]{other.getDocumentID(),other.getCreatorID(), other.getDocumentName(), other.getDocumentHash(), other.getDocumentType(),String.valueOf(other.getSignable())}
    );
        
        
    }

    @Override
    public int hashCode() {
        
        return Objects.hash(getDocumentID(),getCreatorID(), getDocumentName(), getDocumentHash(), getDocumentType(),String.valueOf(getSignable()));
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "@" + Integer.toHexString(hashCode()) +"documentID=" + getDocumentID() + "creatorID=" + getCreatorID() + ", documentName=" + getDocumentName() 
                + ", documentHash=" + getDocumentHash() + ", docType=" + getDocumentType() + "signable=" + String.valueOf(getSignable()) + "]";
    }
    


    


}